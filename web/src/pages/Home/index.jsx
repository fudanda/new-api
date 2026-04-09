/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { useActualTheme } from '../../context/Theme';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { IconBolt, IconSend, IconShield } from '@douyinfe/semi-icons';
import NoticeModal from '../../components/layout/NoticeModal';

const Home = () => {
  const { t, i18n } = useTranslation();
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      let content = data;
      if (!data.startsWith('https://')) {
        content = marked.parse(data);
      }
      setHomePageContent(content);
      localStorage.setItem('home_page_content', content);

      // 如果内容是 URL，则发送主题模式
      if (data.startsWith('https://')) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
          iframe.onload = () => {
            iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
            iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
          };
        }
      }
    } else {
      showError(message);
      setHomePageContent('加载首页内容失败...');
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  return (
    <div className='w-full overflow-x-hidden'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className='home-content-refresh'>
          <div className='home-content-refresh-inner'>
            {/* //logo */}
            <h1 className='home-content-refresh-title'>LZClaw</h1>
            <p className='home-content-refresh-subtitle'>
              {t('探索无限可能，释放AI潜能')}
            </p>
            <div className='home-content-refresh-grid'>
              <article className='home-content-refresh-card'>
                <h2 className='home-content-refresh-card-title'>
                  <IconSend className='home-content-refresh-card-icon' />
                  <span>{t('直接交付结果')}</span>
                </h2>
                <p className='home-content-refresh-card-desc'>
                  {t(
                    '从“想法”到“落地行动”，根据你的指令，自主规划并交付多模态复杂结果。',
                  )}
                </p>
              </article>
              <article className='home-content-refresh-card'>
                <h2 className='home-content-refresh-card-title'>
                  <IconBolt className='home-content-refresh-card-icon' />
                  <span>{t('重新定义“效率”')}</span>
                </h2>
                <p className='home-content-refresh-card-desc'>
                  {t(
                    '内置主流 Skills 扩展能力边界，覆盖工作、学习、创作等多场景。',
                  )}
                </p>
              </article>
              <article className='home-content-refresh-card'>
                <h2 className='home-content-refresh-card-title'>
                  <IconShield className='home-content-refresh-card-icon' />
                  <span>{t('本地安全运行')}</span>
                </h2>
                <p className='home-content-refresh-card-desc'>
                  {t(
                    '数据留在本地，目录边界授权、工具调用审批、操作可回溯，你始终掌控全局。',
                  )}
                </p>
              </article>
            </div>
          </div>
        </div>
      ) : (
        <div className='overflow-x-hidden w-full'>
          {homePageContent.startsWith('https://') ? (
            <iframe
              src={homePageContent}
              className='w-full h-screen border-none'
            />
          ) : (
            <div
              className='mt-[60px]'
              dangerouslySetInnerHTML={{ __html: homePageContent }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
