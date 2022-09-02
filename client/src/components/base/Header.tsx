import errorHandler from '@/api/ErrorHandler';
import UserAPI from '@/api/UserAPI';
import styled from '@emotion/styled';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthButton from '@components/base/AuthButton';

const Header = () => {
  const navigate = useNavigate();
  const [isLogined, setIsLogined] = React.useState(false); // 로그인 전역변수 대체
  const [isMainFirstPage, setIsMainFirstPage] = React.useState(true);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 900 && location.pathname === '/') {
      setIsMainFirstPage(false);
    } else {
      setIsMainFirstPage(true);
    }
  };

  React.useEffect(() => {
    if (location.pathname === '/') {
      setIsMainFirstPage(true);
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    if (location.pathname !== '/') {
      setIsMainFirstPage(false);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (location.pathname === '/') {
      setIsMainFirstPage(true);
    } else {
      setIsMainFirstPage(false);
    }
  }, []);

  return (
    <>
      <HeaderBlock istransparent={isMainFirstPage}>
        <InnerHeader>
          <Title fontWhite={isMainFirstPage} onClick={() => navigate('/')}>
            정치 발자국
          </Title>
          <AuthContainer>
            <AuthButton />
          </AuthContainer>
        </InnerHeader>
      </HeaderBlock>
    </>
  );
};

export default Header;

interface HeaderBlockProps {
  istransparent: boolean;
}

const HeaderBlock = styled.header<HeaderBlockProps>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  background-color: ${props => (props.istransparent ? 'transparent' : '#fff')};
  transition: all 0.5s ease 0s;
`;

const InnerHeader = styled.section`
  position: relative;
  width: 1296px;
  height: 72px;
  padding: 19px 0;
  margin: 0 auto;
  background-color:transparent
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

interface TitleProps {
  fontWhite: boolean;
}

const Title = styled.h1<TitleProps>`
  display: block;
  font-size: 1.5em;
  font-weight: bold;
  justify-self: center;
  color: ${props => (props.fontWhite ? '#fff' : '#000')};
  cursor: pointer;
`;

const AuthContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
`;