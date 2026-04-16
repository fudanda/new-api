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
import NoticeModal from '../../components/layout/NoticeModal';

const setupSteps = [
  {
    id: '01',
    title: '下载安装',
    desc: '打开即可开始安装，减少环境准备成本。',
  },
  {
    id: '02',
    title: '配置 API',
    desc: '按提示完成模型接入配置，快速进入可用状态。',
  },
  {
    id: '03',
    title: '开始完成任务',
    desc: '选择技能、调用智能体或直接使用快捷功能，让 AI 真正帮你做事。',
  },
];

const assistants = [
  {
    title: '股票助手',
    portrait: '/icon/stock-assistant-character.png',
    featureIcon: '/icon/stocks.png',
    desc: 'A 股公告追踪、个股深度分析、交易复盘，支持美港股行情、基本面、技术指标与风险评估。',
  },
  {
    title: '内容创作',
    portrait: '/icon/content-creator-character.png',
    featureIcon: '/icon/content-creation.png',
    desc: '一站式内容创作：选题、撰写、排版、润色，适用于文章、营销文案和社交媒体帖子。',
  },
  {
    title: '备课出卷专家',
    portrait: '/icon/lesson-planning-expert-character.png',
    featureIcon: '/icon/exam-paper.png',
    desc: '阅读教材和教学参考资料，生成教案、试卷、答案解析或英语听力原文。',
  },
  {
    title: '内容总结助手',
    portrait: '/icon/content-summary-assistant-character.png',
    featureIcon: '/icon/summary.png',
    desc: '支持音视频、链接、文档摘要，自动识别会议、讲座、访谈等内容类型。',
  },
  {
    title: '医疗健康解读',
    portrait: '/icon/medical-health-interpreter-character.png',
    featureIcon: '/icon/medical-health.png',
    desc: '体检报告、化验单、医学指标的通俗解读，帮你看懂每一项数值的含义和注意事项。',
  },
  {
    title: '萌宠管家',
    portrait: '/icon/pet-butler-character.png',
    featureIcon: '/icon/pet-care.png',
    desc: '猫狗日常饲养、异常行为分析、食品配料解读，做你身边有温度的宠物百科。',
  },
];

const imPlatforms = [
  { name: '微信', icon: '/icon/wechat.png' },
  {
    name: '钉钉',
    icon: '/icon/dingtalk.png',
  },
  {
    name: '飞书',
    icon: '/icon/lark.png',
  },
  {
    name: '企业微信',
    icon: '/icon/wecom.png',
  },
];

const quickActions = [
  {
    title: 'PPT制作',
    iconName: 'PPT',
    icon: '/icon/ppt.png',
    tag: '演示汇报',
    desc: '更快完成汇报内容组织与页面结构搭建，让演示材料更容易成型。',
    chips: ['工作汇报', '内容调研', '教育教学', '科普演讲'],
  },
  {
    title: '数据分析',
    iconName: 'Excel',
    icon: '/icon/excel.png',
    tag: '效率分析',
    desc: '帮助理解表格结构、整理字段与汇总结论，让数据处理更直接。',
    chips: ['汇总统计', '图片转表', '数据报告', '多表合并'],
  },
  {
    title: '教育学习',
    iconName: 'Learning',
    icon: '/icon/education-learning.png',
    tag: '日常办公',
    desc: '全方位降低学习门槛、提升学习效率与知识掌握效果。',
    chips: ['英语单词', '数学讲解', '作文辅导', '知识点科普'],
  },
  {
    title: '网站创建',
    iconName: 'HTML',
    icon: '/icon/html.png',
    tag: '轻量建站',
    desc: '快速生成轻量展示型页面，适合多种低门槛建站场景直接使用。',
    chips: ['个人简历', '店铺主页', '电子邀请函', '调查问卷'],
  },
];

const skillEcosystem = [
  {
    title: '多智能体协同',
    iconName: 'Agents',
    icon: '/icon/multi-agent-collaboration.png',
    desc: '支持围绕具体任务创建专属助手，多个智能体协同对话，让不同工作拥有更贴合的处理方式。',
    action: '多 Agent 对话',
  },
  {
    title: '丰富 Skills 生态',
    iconName: 'Skills',
    icon: '/icon/rich-skills-ecosystem.png',
    desc: '丰富的 Skill 库，内置海量专业技能插件，可快速调用满足多样化场景需求，随取随用。',
    action: '丰富生态',
  },
  {
    title: '一键生成',
    iconName: 'Generate',
    icon: '/icon/one-click-generate.png',
    desc: '一键生成 PPT / 官网 / 简历等多种内容，高效便捷。',
    action: '快捷生成',
  },
  {
    title: '记忆可视化',
    iconName: 'Memory',
    icon: '/icon/memory-visualization.png',
    desc: 'AI 对话记忆与历史数据直观呈现，清晰展示交互流转信息，持续成长，越来越懂你。',
    action: '记忆可视',
  },
  {
    title: '一键配置 IM',
    iconName: 'IM',
    icon: '/icon/one-click-im-setup.png',
    desc: '无需复杂开发，快速完成即时通讯功能的接入与配置，随时随地远程让 AI 干活。',
    action: '移动直连',
  },
  {
    title: '模型配置更便捷',
    iconName: 'Models',
    icon: '/icon/easier-model-config.png',
    desc: '简化 AI 模型参数设置流程，零基础也能快速完成部署调整，直接操控文件，不是只会聊天。',
    action: '高效配置',
  },
];

const lzclawDownloadUrl = '/download/lzclaw-setup.exe';
const lzclawContactQRCodeUrl = '/qrcode.png';
const setupScreenshotUrl = '/icon/SETUP.png';
const imPhoneFrameUrl = '/icon/iphone.png';
const imPhoneScreenUrl = '/icon/clawboot.jpg';

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
        <div className='home-content-refresh' id='top'>
          <div className='home-content-refresh-glow home-content-refresh-glow-left' />
          <div className='home-content-refresh-glow home-content-refresh-glow-right' />
          <div className='home-content-refresh-inner'>
            <section className='home-refresh-hero'>
              <span className='home-refresh-kicker'>
                {t('更丰富的能力，更简单的上手体验')}
              </span>
              <h1 className='home-refresh-title'>
                {t('技能更丰富 上手更简单的')}{' '}
                <span>{t('AI 助手')}</span>
              </h1>
              <p className='home-refresh-subtitle'>
                {t(
                  '从技能调用到智能体定制，从幻灯片制作到数据分析、学习辅助与轻量网站创建，LZCLAW 让 AI 不止会聊天，而是更快进入你的实际工作流。',
                )}
              </p>
              <div className='home-refresh-actions'>
                <a className='home-refresh-button' href={lzclawDownloadUrl}>
                  {t('立即下载')}
                </a>
              </div>
              <div className='home-refresh-hint'>
                {t('一键安装，快速上手')}
              </div>
            </section>

            <section className='home-refresh-panel'>
              <span className='home-refresh-section-tag'>SETUP</span>
              <h2 className='home-refresh-section-title'>
                {t('一键安装与环境整合，')}{' '}
                <span>{t('开箱即用')}</span>
                {t('更省心')}
              </h2>
              <p className='home-refresh-section-desc'>
                {t('三步开始，让 AI 更快进入你的工作流')}
              </p>
              <div className='home-refresh-step-grid'>
                {setupSteps.map((step) => (
                  <article className='home-refresh-step-card' key={step.id}>
                    <span className='home-refresh-step-index'>{step.id}</span>
                    <h3>{t(step.title)}</h3>
                    <p>{t(step.desc)}</p>
                  </article>
                ))}
              </div>
              <div className='home-refresh-note'>
                {t(
                  '不把复杂的准备工作留给用户，尽量降低安装与使用门槛，让新手也能更快进入可用状态。',
                )}
              </div>
              <div className='home-refresh-appshot'>
                <div className='home-refresh-appshot-callout home-refresh-appshot-callout-left'>
                  <span>{t('一键安装')}</span>
                  <strong>{t('开箱即用更省心')}</strong>
                </div>
                <div className='home-refresh-appshot-window'>
                  <img
                    className='home-refresh-appshot-image'
                    src={setupScreenshotUrl}
                    alt={t('LZClaw 安装与界面截图')}
                  />
                </div>
                <div className='home-refresh-appshot-callout home-refresh-appshot-callout-right'>
                  <span>{t('技能库')}</span>
                  <strong>{t('覆盖多类高频任务')}</strong>
                </div>
              </div>
            </section>

            <section className='home-refresh-section home-refresh-section-agents'>
              <span className='home-refresh-section-tag'>AGENTS</span>
              <h2 className='home-refresh-section-title'>
                {t('多智能体协同，')}{' '}
                <span>{t('可定制')}</span>
                {t('的智能体，更贴合你的使用方式')}
              </h2>
              <p className='home-refresh-section-desc home-refresh-section-desc-wide'>
                {t(
                  '不只是固定功能集合，而是可以围绕具体任务创建更适合的助手。根据你的目标组合技能、组织流程，让 AI 用起来更顺手。',
                )}
              </p>
              <div className='home-refresh-agent-grid'>
                {assistants.map((item) => (
                  <article className='home-refresh-agent-card' key={item.title}>
                    <div className='home-refresh-agent-portrait-wrap'>
                      <div className='home-refresh-agent-portrait'>
                        <img
                          className='home-refresh-agent-portrait-image'
                          src={item.portrait}
                          alt={item.title}
                        />
                      </div>
                    </div>
                    <div className='home-refresh-agent-content'>
                      <div className='home-refresh-agent-heading'>
                        <span className='home-refresh-agent-feature-icon'>
                          <img src={item.featureIcon} alt={item.title} />
                        </span>
                        <h3>{t(item.title)}</h3>
                      </div>
                      <p>{t(item.desc)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className='home-refresh-im'>
              <div className='home-refresh-im-copy'>
                <span className='home-refresh-section-tag'>IM ACCESS</span>
                <h2 className='home-refresh-section-title'>
                  {t('更自然的任务入口，更顺手的消息交互')}{' '}
                  <span>{t('随时随地')}</span>
                  {t('，掌控您的工作站')}
                </h2>
                <p className='home-refresh-section-desc home-refresh-section-desc-im'>
                  {t(
                    '支持微信、钉钉、飞书、企业微信等常用沟通入口，把任务下发和结果反馈放进更熟悉的使用场景里。',
                  )}
                </p>
                <div className='home-refresh-platforms'>
                  {imPlatforms.map((item) => (
                    <div className='home-refresh-platform' key={item.name}>
                      <span className='home-refresh-platform-icon'>
                        <img src={item.icon} alt={item.name} />
                      </span>
                      <span className='home-refresh-platform-name'>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className='home-refresh-phone'>
                <div className='home-refresh-phone-device'>
                  <div className='home-refresh-phone-screen'>
                    <img
                      src={imPhoneScreenUrl}
                      alt={t('LZClaw 手机界面截图')}
                    />
                  </div>
                  <img
                    className='home-refresh-phone-shell'
                    src={imPhoneFrameUrl}
                    alt='iPhone frame'
                  />
                </div>
              </div>
            </section>

            <section className='home-refresh-panel home-refresh-panel-compact'>
              <span className='home-refresh-section-tag'>QUICK ACTIONS</span>
              <h2 className='home-refresh-section-title'>
                {t('从')}{' '}
                <span>{t('高频任务')}</span>
                {t('开始，把 AI 真正用起来')}
              </h2>
              <p className='home-refresh-section-desc home-refresh-section-desc-wide'>
                {t(
                  '不只回答问题，还能覆盖整理、写作、生成、分析等常见任务。用分类展示能力，用代表技能体现实用性。',
                )}
              </p>
              <div className='home-refresh-action-grid'>
                {quickActions.map((item) => (
                  <article className='home-refresh-action-card' key={item.title}>
                    <span className='home-refresh-action-mark'>
                      <img src={item.icon} alt={item.iconName} />
                    </span>
                    <div className='home-refresh-action-head'>
                      <h3>{t(item.title)}</h3>
                      <span className='home-refresh-action-tag'>{t(item.tag)}</span>
                    </div>
                    <p>{t(item.desc)}</p>
                    <div className='home-refresh-chip-list'>
                      {item.chips.map((chip) => (
                        <span className='home-refresh-chip' key={chip}>
                          {t(chip)}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className='home-refresh-section'>
              <span className='home-refresh-section-tag'>SKILL LIBRARY</span>
              <h2 className='home-refresh-section-title'>
                {t('模块化 AI 能力生态，')}{' '}
                <span>{t('灵活适配')}</span>
                {t('多元使用场景')}
              </h2>
              <p className='home-refresh-section-desc home-refresh-section-desc-wide'>
                {t(
                  '集协同、创作、记忆、部署于一体，可扩展的功能组合满足个性化需求。',
                )}
              </p>
              <div className='home-refresh-ecosystem-grid'>
                {skillEcosystem.map((item) => (
                  <article className='home-refresh-ecosystem-card' key={item.title}>
                    <span className='home-refresh-ecosystem-icon'>
                      <img src={item.icon} alt={item.iconName} />
                    </span>
                    <span className='home-refresh-ecosystem-icon-name'>
                      {item.iconName}
                    </span>
                    <h3>{t(item.title)}</h3>
                    <p>{t(item.desc)}</p>
                    <span className='home-refresh-ecosystem-action'>
                      {t(item.action)}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className='home-refresh-download' id='home-download'>
              <span className='home-refresh-section-tag'>CONTACT</span>
              <h2 className='home-refresh-section-title home-refresh-download-title'>
                {t('获取 LZCLAW，让 AI 更快变成你的效率工具')}
              </h2>
              <p className='home-refresh-section-desc home-refresh-section-desc-wide'>
                {t(
                  '从技能库、智能体到快捷功能与 IM 接入，把常用任务交给更顺手的 AI 助手来完成。',
                )}
              </p>
              <div className='home-refresh-download-qr-wrap'>
                <img
                  className='home-refresh-download-qr'
                  src={lzclawContactQRCodeUrl}
                  alt={t('LZClaw 联系二维码')}
                />
              </div>
              <div className='home-refresh-download-cta'>
                {t('扫码添加微信，了解LZClaw')}
              </div>
            </section>
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
