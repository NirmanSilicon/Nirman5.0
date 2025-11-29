import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const StatsBox = ({ title, value, change, changeType = 'neutral', icon: Icon, color = 'blue' }) => {
  const getColorClasses = (type) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          icon: 'text-green-500',
        };
      case 'negative':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          icon: 'text-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          icon: 'text-yellow-500',
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          icon: 'text-gray-500',
        };
    }
  };

  const colorClasses = getColorClasses(changeType);

  const getTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="h-4 w-4" />;
    if (changeType === 'negative') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getStatusIcon = () => {
    if (title.toLowerCase().includes('resolved')) return <CheckCircle className="h-8 w-8" />;
    if (title.toLowerCase().includes('pending')) return <Clock className="h-8 w-8" />;
    if (title.toLowerCase().includes('urgent')) return <AlertTriangle className="h-8 w-8" />;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
          
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${colorClasses.text}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium ml-1">
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
              <span className="text-xs ml-1 opacity-75">from last period</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses.bg}`}>
          <div className={colorClasses.icon}>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBox;
