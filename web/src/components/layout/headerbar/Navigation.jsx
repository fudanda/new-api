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

import React from 'react';
import { Link } from 'react-router-dom';
import SkeletonWrapper from '../components/SkeletonWrapper';

const Navigation = ({
  mainNavLinks,
  isMobile,
  isLoading,
  useLightText,
  userState,
  pricingRequireAuth,
}) => {
  const renderNavLinks = () => {
    const baseClasses = useLightText
      ? 'flex-shrink-0 flex items-center gap-1 rounded-full text-[15px] font-semibold tracking-[0.01em] transition-all duration-200 ease-in-out'
      : 'flex-shrink-0 flex items-center gap-1 font-semibold rounded-md transition-all duration-200 ease-in-out';
    const hoverClasses = useLightText
      ? 'text-white/92 hover:text-white hover:bg-white/8'
      : 'hover:text-semi-color-primary';
    const spacingClasses = useLightText
      ? isMobile
        ? 'px-2.5 py-1.5'
        : 'px-3 py-2'
      : isMobile
        ? 'p-1'
        : 'p-2';

    const commonLinkClasses = `${baseClasses} ${spacingClasses} ${hoverClasses}`;

    return mainNavLinks.map((link) => {
      const linkContent = (
        <span
          className={useLightText ? '!text-white' : undefined}
          style={useLightText ? { color: '#ffffff' } : undefined}
        >
          {link.text}
        </span>
      );

      if (link.isExternal) {
        return (
          <a
            key={link.itemKey}
            href={link.externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className={commonLinkClasses}
          >
            {linkContent}
          </a>
        );
      }

      let targetPath = link.to;
      if (link.itemKey === 'console' && !userState.user) {
        targetPath = '/login';
      }
      if (link.itemKey === 'pricing' && pricingRequireAuth && !userState.user) {
        targetPath = '/login';
      }

      return (
        <Link key={link.itemKey} to={targetPath} className={commonLinkClasses}>
          {linkContent}
        </Link>
      );
    });
  };

  return (
    <nav
      className={`flex flex-1 items-center overflow-x-auto whitespace-nowrap scrollbar-hide ${useLightText ? 'gap-1.5 mx-3 md:mx-6' : 'gap-1 lg:gap-2 mx-2 md:mx-4'}`}
    >
      <SkeletonWrapper
        loading={isLoading}
        type='navigation'
        count={4}
        width={60}
        height={16}
        isMobile={isMobile}
      >
        {renderNavLinks()}
      </SkeletonWrapper>
    </nav>
  );
};

export default Navigation;
