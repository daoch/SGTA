'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NavigationCard } from '../types';

interface HubNavigationCardProps {
  card: NavigationCard;
}

export const HubNavigationCard: React.FC<HubNavigationCardProps> = ({ card }) => {
  const {
    title,
    description,
    icon,
    href,
    linkText,
    pendingCount,
    pendingText,
    alertText,
    iconBgColor,
    iconColor,
    linkColor,
    linkHoverColor
  } = card;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ring-1 ring-gray-200">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className={`h-12 w-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
          {pendingCount && pendingCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              {pendingCount} {pendingText || 'pendientes'}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
        <Link href={href} className={`${linkColor} hover:${linkHoverColor} font-medium text-sm flex items-center`}>
          {linkText}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
        {pendingCount && pendingCount > 0 && alertText && (
          <span className="text-xs text-red-600 font-medium">{alertText}</span>
        )}
      </div>
    </div>
  );
};

export default HubNavigationCard;