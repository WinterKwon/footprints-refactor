import React, { useEffect, useRef, useState } from 'react';
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
import { PollFormatter, ScoreFormatter } from '@/utils/Formatter';
import DateFormatter from '@/utils/DateFormatter';
import styled from '@emotion/styled';
import { getElementAtEvent, Line } from 'react-chartjs-2';
import dinosaur from '@/assets/tribe/dinosaur.png';
import elephant from '@/assets/tribe/elephant.png';
import hippo from '@/assets/tribe/hippo.png';
import lion from '@/assets/tribe/lion.png';
import tiger from '@/assets/tribe/tiger.png';

import GraphAPI from '@/api/GraphAPI';
import Modal from './PoliticianModal';
import { PoliticiansTypes } from '@/types/PoliticiansTypes';
import { useRecoilValue } from 'recoil';
import PoliticiansState from '@/store/PoliticiansState';
import { useParams } from 'react-router-dom';
import { ResTypes, ResDataTypes, pollDeep } from '@/types/GraphTypes';
import { BsArrowRepeat } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

const PoliticianGraph = (): JSX.Element => {
  const chartRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState<any>();
  const [issueDate, setIssueDate] = useState<any>([]);
  const [content, setContent] = useState<any>([]);
  const [data, setData] = useState<any>();
  const [isFirst, setIsFirst] = useState(true);
  const [index, setIndex] = useState<number>(1);
  const [NextPageable, isNextPageable] = useState<boolean>(true);
  const [contentId, setContentId] = useState<any>([]);
  const [resData, setResData] = useState<any>([]);
  const id = useLocation().pathname.split('/')[2];

  const fetchedPoliticans = useRecoilValue(PoliticiansState);

  const politicansName = fetchedPoliticans.filter(
    (politician: PoliticiansTypes) => {
      if (politician._id === id) {
        console.log(politician.politicianInfo[0].name);
        return politician.politicianInfo[0].name;
      }
    },
  );

  console.log(politicansName[0].politicianInfo[0].name);
  function ClickHander(element: InteractionItem[]) {
    if (element.length !== 0) {
      const { datasetIndex, index } = element[0];
      setOpen(!open);
      document.body.style.overflow = 'hidden';
      return element[0].element;
    }
  }

  const getData = async (index: number | Number) => {
    console.log(id);
    const res = await GraphAPI.getGraph(id, index);
    res.data.data.map(async (res: ResTypes, index: number) => {
      setResData((current: any) => {
        let tempData = DateFormatter(res.issueDate);
        let tempPoll = PollFormatter(res);
        let tempScore = ScoreFormatter(res);

        if (index === 0) {
          const issueDate = [tempData];
          const poll = [tempPoll];
          const content = [res.content];
          const score = [tempScore];
          const id = [res._id];
          const title = [res.title];

          return { issueDate, poll, content, score, id, title };
        } else {
          const issueDate = [...current.issueDate, tempData];
          const poll = [...current.poll, tempPoll];
          const content = [...current.content, res.content];
          const score = [...current.score, tempScore];
          const id = [...current.id, res._id];
          const title = [...current.title, res.title];

          return { issueDate, poll, content, score, id, title };
        }
      });
    });

    isNextPageable(res.data.meta.hasNextPage);
  };
  const Img = [dinosaur, elephant, hippo, lion, tiger];
  const chartPoint = Img.map(img => {
    const chartPoint = new Image();
    chartPoint.src = img;
    chartPoint.width = 30;
    chartPoint.height = 30;
    return chartPoint;
  });

  const start = async () => {
    if (isFirst === true) {
      await getData(index);
      setIsFirst(false);
    } else {
      setData({
        labels: resData.issueDate,
        datasets: [
          {
            data: resData.score.map((score: any) => {
              return score.dinosaur.score;
            }),
            tension: 0.3,
            borderColor: 'yellow',
            pointStyle: chartPoint[0],
            pointBorderColor: 'black',
            pointRadius: 5,
          },
          {
            data: resData.score.map((score: any) => {
              return score.elephant.score;
            }),
            tension: 0.3,
            borderColor: 'skyblue',
            pointStyle: chartPoint[1],
            pointBorderColor: 'black',
            pointRadius: 5,
          },
          {
            data: resData.score.map((score: any) => {
              return score.hippo.score;
            }),
            tension: 0.3,
            borderColor: 'gray',
            pointStyle: chartPoint[2],
            pointBorderColor: 'black',
            pointRadius: 5,
          },
          {
            data: resData.score.map((score: any) => {
              return score.lion.score;
            }),
            tension: 0.3,
            borderColor: 'red',
            pointStyle: chartPoint[3],
            pointBorderColor: 'black',
            pointRadius: 5,
          },
          {
            data: resData.score.map((score: any) => {
              return score.tiger.score;
            }),
            tension: 0.3,
            borderColor: 'pink',
            pointStyle: chartPoint[4],
            pointBorderColor: 'black',
            pointRadius: 5,
          },
          {
            data: resData.score.map((score: any) => {
              return score.total.score;
            }),
            tension: 0.3,
          },
        ],
      });
    }
  };
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
      console.log(231);
      ClickButton();
    }
  }, [index]);

  useEffect(() => {
    start();
    if (!isFirst) {
      start();
    }
  }, [isFirst]);

  const options = {
    maintainAspectRatio: false,

    plugins: {
      tooltip: {
        enabled: false,
        maintainAspectRatio: true,
        external: function (context: any) {
          darwTooltip(context, resData);
        },
      },

      title: {
        display: true,
        font: {
          size: 30,
        },
        text: `${politicansName[0].politicianInfo[0].name} 인생 그래프`,
      },
      legend: {
        display: false,
      },
      datalabels: {
        font: {
          size: 15,
        },
      },
    },
    elements: {
      point: {
        radius: 15,
        hoverRadius: 15,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

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
            {'<'}
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
                );
                setPoint(point);
              }}
              options={options}
              data={data}
              plugins={[ChartDataLabels]}
            />
          )}
          {index === 1 ? null : (
            <GraphButton
              style={{ marginTop: '-350px', marginRight: '-10px' }}
              onClick={getPreData}
            >
              {'>'}
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
                resData={resData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticianGraph;

function darwTooltip(context: any, resData: ResDataTypes) {
  const ImgTribe = [dinosaur, elephant, hippo, lion, tiger];
  const ImgPoll = [Circle, Triangle, X];

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
    return resData.poll;
  }
  // Set Text
  if (tooltipModel.body) {
    const bodyLines = tooltipModel.body.map(getBody);
    const result = bodyLines[0].map((body: any) => {
      return Object.values(body);
    });
    const tableHead = document.createElement('div');
    const br = document.createElement('br');

    function drow(div: Element, body: pollDeep, index: number) {
      if (index === 0) {
        const Title = document.createElement('div');
        const TitleText = document.createTextNode(
          resData.title[tooltipModel.dataPoints[0].dataIndex],
        );
        Title.style.whiteSpace = 'nowrap';
        Title.style.overflow = 'hidden';
        Title.style.textOverflow = 'ellipsis';
        Title.style.width = '500px';
        Title.style.height = '30px';
        Title.style.textAlign = 'center';
        Title.style.fontWeight = '700';
        Title.style.fontSize = '23px';
        Title.style.backgroundColor = '#f1f1f1';
        Title.style.paddingBottom = '40px';
        Title.appendChild(TitleText);
        tableHead.appendChild(Title);
        tableHead.appendChild(br);
      }

      const imageTh = document.createElement('div');
      const imageTribe = document.createElement('img');
      const imageCircle = document.createElement('img');
      const imageTriangle = document.createElement('img');
      const imageX = document.createElement('img');
      imageTribe.src = ImgTribe[index];
      imageTribe.height = 80;
      imageTribe.width = 80;
      imageTh.appendChild(imageTribe);
      imageTh.style.marginLeft = '70px';
      imageTh.style.fontSize = '25px';
      const img = [imageCircle, imageTriangle, imageX];
      for (let i = 0; i <= 2; i++) {
        const tempDiv = document.createElement('div');
        img[i].src = ImgPoll[i];
        img[i].height = 25;
        img[i].width = 25;

        const count =
          i === 0
            ? document.createTextNode(': ' + body.pro)
            : i === 1
            ? document.createTextNode(': ' + body.neu)
            : document.createTextNode(': ' + body.con);
        img[i].style.marginTop = '30px';
        img[i].style.position = 'relative';
        img[i].style.top = '5px';
        tempDiv.style.display = 'inline';
        tempDiv.style.flexDirection = 'row';
        tempDiv.style.marginRight = '10px';
        tempDiv.style.position = 'relative';
        tempDiv.style.bottom = '20px';

        tempDiv.appendChild(img[i]);
        tempDiv.appendChild(count);
        imageTh.appendChild(tempDiv);
      }

      div.appendChild(imageTh);
    }

    result[tooltipModel.dataPoints[0].dataIndex].forEach(
      (body: any, index: number) => {
        const div = document.createElement('div');
        index === 5 ? null : drow(div, body, index);
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

  tooltipEl.style.pointerEvents = 'none';
  tooltipEl.style.background = '#f5f5dc';
  tooltipEl.style.borderRadius = '5px';
  tooltipEl.style.width = '500px';
  tooltipEl.style.height = '560px';
}

const GraphButton = styled.button`
  height: 3rem;
  width: 3rem;
  font-size: 30px;
  font-weight: bolder;
  border-radius: 30px;
  border-width: 0.5px;
  float: right;
  opacity: 0.9;
  transition-duration: 0.4s;
  background-color: #babbbd;
  &:hover {
    color: white;
    background-color: #676168;
  }
`;
