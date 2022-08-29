import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  InteractionItem,
} from 'chart.js';
import Circle from '@/assets/img/circle.png';
import Triangle from '@/assets/img/triangle.png';
import X from '@/assets/img/x.png';

import dateFormatter from '@/utils/DateFormatter';
import styled from '@emotion/styled';
import { getElementAtEvent, Line } from 'react-chartjs-2';
import GraphAPI from '@/api/GraphAPI';
import Modal from './PoliticianModal';
import { BsArrowRepeat } from 'react-icons/bs';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface ResTypes {
  targetPolitician: string;
  _id: string;
  createdAt: Date;
  regiUser: string;
  regiStatus: string;
  regi: { pro: number; con: number };
  poll: { pro: number; con: number; neu: number };
  issueDate: Date;
  pollDate: Date;
  content: string;
  isPollActive: boolean;
  updatedAt: Date;
  score: number;
}

const PoliticianGraph = (): JSX.Element => {
  const chartRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<any>();
  const [issueDate, setIssueDate] = useState<any>([]);
  const [poll, setPoll] = useState<any>([]);
  const [content, setContent] = useState<any>([]);
  const [score, setScore] = useState<any>([]);
  const [data, setData] = useState<any>();
  const [isFirst, setIsFirst] = useState(true);
  const [index, setIndex] = useState<number>(1);
  const [NextPageable, isNextPageable] = useState<boolean>(true);
  const [contentId, setContentId] = useState<any>([]);
  const [resData, setResData] = useState<any>([]);
  function ClickHander(
    element: InteractionItem[],
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) {
    if (element.length !== 0) {
      const { datasetIndex, index } = element[0];
      setOpen(!open);
      document.body.style.overflow = 'hidden';

      return element[0].element;
    }
  }

  const getData = async (index: number | Number) => {
    let target = '6303bed2e9d44f884ed1d640';
    const res = await GraphAPI.getGraph(target, index);
    console.log(res);

    res.data.data.map(async (res: ResTypes, index: number) => {
      setIssueDate((current: Date[] | []) => {
        let data = dateFormatter(res.issueDate);
        if (index === 0) {
          const temp = [data];

          return temp;
        } else {
          const temp = [...current, data];

          return temp;
        }
      });

      setPoll((current: any) => {
        if (index === 0) {
          const temp = [res.poll];
          return temp;
        } else {
          const temp = [...current, res.poll];
          return temp;
        }
      });

      setContent((current: any) => {
        if (index === 0) {
          const temp = [res.content];
          return temp;
        } else {
          const temp = [...current, res.content];
          return temp;
        }
      });

      setScore((current: any) => {
        if (index === 0) {
          const temp = [res.poll.pro - res.poll.con];
          return temp;
        } else {
          const temp = [...current, res.poll.pro - res.poll.con];
          return temp;
        }
      });
      setContentId((current: any) => {
        if (index === 0) {
          const temp = [res._id];
          return temp;
        } else {
          const temp = [...current, res._id];
          return temp;
        }
      });
    });

    setResData((current: any) => {
      if (index === 0) {
        const temp = [res];
        return temp;
      } else {
        const temp = [...current, res];
        return temp;
      }
    });

    isNextPageable(res.data.meta.hasNextPage);
  };

  const start = async () => {
    if (isFirst === true) {
      await getData(index);
      setIsFirst(false);
    }

    setData({
      labels: issueDate,
      datasets: [
        {
          data: score,
          tension: 0.3,
          fill: {
            target: { value: 0 },
            below: 'rgba(255, 26, 104, 0.2)',
            above: 'rgba(75, 192, 192,0.2)',
          },
        },
      ],
    });
  };
  useEffect(() => {
    console.log(document.body.offsetWidth);
  }, [document.body.offsetWidth]);
  const getNextData = async () => {
    await getData(index + 1);
    setIndex(index + 1);
  };
  const getPreData = async () => {
    await getData(index - 1);
    setIndex(index - 1);
  };
  const ClickButton = async () => {
    await start();
  };
  useEffect(() => {
    if (isFirst === false) {
      ClickButton();
    }
  }, [index]);

  useEffect(() => {
    start();
    if (!isFirst) {
      setTimeout(() => {
        () => start();
      }, 1);
    } else {
      setTimeout(() => {
        () => start();
      }, 1);
    }
    console.log(isFirst);
  }, [isFirst]);

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
        maintainAspectRatio: true,
        external: function (context: any) {
          let tooltipEl = document.getElementById('chartjs-tooltip');
          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = '<div></div>';
            document.body.appendChild(tooltipEl);
          }

          // Hide if no tooltip
          const tooltipModel = context.tooltip;
          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = '0';
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add('no-transform');
          }

          function getBody() {
            return poll;
          }
          // Set Text
          if (tooltipModel.body) {
            const bodyLines = tooltipModel.body.map(getBody);
            const result = bodyLines[0].map((body: any) => {
              return Object.values(body);
            });
            const tableHead = document.createElement('div');
            function drow(div: Element, body: Element, index: number) {
              const imgSrc = [Circle, Triangle, X];
              const imageTh = document.createElement('span');
              const image = document.createElement('img');
              image.src = imgSrc[index];
              image.height = 20;
              image.width = 20;
              image.style.position = 'relative';
              image.style.top = '3px';
              imageTh.style.padding = '10px';
              image.style.display = 'inline-block';
              imageTh.appendChild(image);

              const numSpan = document.createElement('span');
              const num = document.createTextNode(': ' + body);
              numSpan.appendChild(num);

              const br = document.createElement('br');
              div.appendChild(imageTh);
              div.appendChild(numSpan);
              div.appendChild(br);
            }
            result[tooltipModel.dataPoints[0].dataIndex].forEach(
              (body: any, index: number) => {
                const div = document.createElement('div');
                drow(div, body, index);
                tableHead.appendChild(div);
              },
            );

            const tableRoot = tooltipEl.querySelector('div');

            // Remove old children
            if (tableRoot && tableRoot.firstChild) {
              while (tableRoot.firstChild) {
                tableRoot.firstChild.remove();
              }
            }
            // Add new children
            tableRoot?.appendChild(tableHead);
          }

          const position = context.chart.canvas.getBoundingClientRect();

          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left =
            position.left + window.pageXOffset + tooltipModel.caretX + 'px';
          tooltipEl.style.top =
            position.top + window.pageYOffset + tooltipModel.caretY + 'px';
          // tooltipEl.style.font = bodyFont.string;
          tooltipEl.style.padding =
            tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
          tooltipEl.style.pointerEvents = 'none';
          tooltipEl.style.background = '#f5f5dc';
          tooltipEl.style.padding = '15px';
          tooltipEl.style.borderRadius = '5px';
          tooltipEl.style.width = '150px';
          tooltipEl.style.height = '100px';
        },
      },

      title: {
        display: true,
        font: {
          size: 30,
        },
        text: '윤석열 인생 그래프',
      },
      legend: {
        display: false,
      },
    },
  };
  const string1 = '<';
  const string2 = '>';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '700px',
        marginBottom: '50px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          margin: '100px 0 30px 0px',
        }}
      >
        {NextPageable === false ? null : (
          <GraphButton
            style={{ float: 'left', marginTop: '350px' }}
            onClick={getNextData}
          >
            {string1}
          </GraphButton>
        )}

        <div
          style={{
            height: '100%',
            width: '80%',
          }}
        >
          {data && (
            <Line
              ref={chartRef}
              onClick={event => {
                let point = ClickHander(
                  getElementAtEvent(chartRef.current, event),
                  event,
                );
                setPoint(point);
              }}
              options={options}
              data={data}
            />
          )}
          <button
            onClick={ClickButton}
            style={{
              position: 'relative',
              float: 'right',
              marginTop: '-700px',
              marginRight: '100px',
            }}
          >
            <BsArrowRepeat size="40" />
          </button>
          {index === 1 ? null : (
            <GraphButton
              style={{ marginTop: '-350px', marginRight: '-10px' }}
              onClick={getPreData}
            >
              {string2}
            </GraphButton>
          )}
          <div>
            {open && (
              <Modal
                setOpen={setOpen}
                element={point}
                content={content}
                contentId={contentId}
                issueDate={issueDate}
                resPoll={poll}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticianGraph;

interface Props {}
const GraphButton = styled.button<Props>`
  height: 3rem;
  width: 3rem;
  font-size: 30px;
  font-weight: bolder;
  border-radius: 30px;
  border-width: 0.5px;
  float: right;
  opacity: 0.9;
  transition-duration: 0.4s;
  background-color: #008cba;
  &:hover {
    color: white;
    background-color: skyblue;
  }
`;
