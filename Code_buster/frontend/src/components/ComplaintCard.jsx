import React from 'react';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Phone,
  MessageSquare,
  Tag,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const ComplaintCard = ({ complaint, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-gray-900">{complaint.name}</span>
            <Phone className="h-4 w-4 text-gray-500 ml-2" />
            <span className="text-sm text-gray-600">{complaint.phone}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{complaint.address}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
            {complaint.status.replace('_', ' ').toUpperCase()}
          </span>
          
          {complaint.urgency && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(complaint.urgency)}`}>
              {complaint.urgency.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Complaint Text */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MessageSquare className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Complaint</span>
          {complaint.sentiment && (
            <div className="flex items-center space-x-1">
              {getSentimentIcon(complaint.sentiment)}
              <span className="text-xs text-gray-500">{complaint.sentiment}</span>
            </div>
          )}
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
          {truncateText(complaint.complaint_text)}
        </p>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          {complaint.category && (
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 capitalize">{complaint.category}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{formatDate(complaint.created_at)}</span>
          </div>
        </div>

        {complaint.confidence_score && (
          <div className="text-xs text-gray-500">
            Confidence: {Math.round(complaint.confidence_score * 100)}%
          </div>
        )}
      </div>

      {/* Actions */}
      {onUpdate && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdate(complaint.id, 'in_progress')}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              In Progress
            </button>
            <button
              onClick={() => onUpdate(complaint.id, 'resolved')}
              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Resolve
            </button>
            <button
              onClick={() => onUpdate(complaint.id, 'rejected')}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;
