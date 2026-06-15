import React from 'react';
import Card from '../../components/common/Card';
import {
  ReplyAvatar, LikeAvatar, MatchIcon, VerificationIcon, SemesterIcon,
  ReviewStarAvatar, ReviewReplyAvatar, ReviewFeedbackAvatar,
} from './NotificationIcons';

const NotificationCard = ({ notification, onMarkRead, onNavigate }) => {
  const { type, title, content, time, isUnread, avatar, image } = notification;

  const renderIcon = () => {
    switch (type) {
      case 'reply': return <ReplyAvatar avatar={avatar} />;
      case 'like': return <LikeAvatar avatar={avatar} />;
      case 'match': return <MatchIcon />;
      case 'verification': return <VerificationIcon />;
      default:
        if (notification.referenceType === 'Semester') return <SemesterIcon />;
        if (notification.referenceType === 'Review') {
          switch (notification.reviewAction) {
            case 'reply': return <ReviewReplyAvatar avatar={avatar} />;
            case 'feedback': return <ReviewFeedbackAvatar avatar={avatar} />;
            case 'new':
            default: return <ReviewStarAvatar avatar={avatar} />;
          }
        }
        return <div className="w-10 h-10 bg-white/10 rounded-full" />;
    }
  };

  const renderTitle = () => {
    if (type === 'reply' || type === 'like' || notification.referenceType === 'Review') {
      const words = title.split(' ');
      if (words.length >= 2) {
        return (
          <>
            <span className="text-primary-blue">{words[0]} {words[1]}</span>{' '}
            <span className="text-text-primary">{words.slice(2).join(' ')}</span>
          </>
        );
      }
    }
    return <span className="text-text-primary">{title}</span>;
  };

  const handleClick = () => {
    if (isUnread && onMarkRead) onMarkRead(notification.id);
    if (notification.referenceId && notification.referenceType && onNavigate) {
      onNavigate(notification.referenceId, notification.referenceType, notification);
    }
  };

  return (
    <Card variant="container" padding="p-0" className={`transition-all duration-300 ${
      isUnread ? '!bg-[#162743] !border-primary-blue/30 cursor-pointer' : 'hover:!bg-white/10 hover:!border-white/15 cursor-pointer'
    }`}>
      <div className="flex items-start gap-4 p-5 sm:p-6 w-full h-full relative" onClick={handleClick}>
        {renderIcon()}
        <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
          <h3 className="text-body-small-bold sm:text-body-medium-bold">{renderTitle()}</h3>
          <p className={`text-body-small ${type === 'reply' ? 'text-text-secondary italic' : 'text-text-secondary'}`}>{content}</p>
          <span className="text-[12px] text-text-tertiary mt-1">{time}</span>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 h-full">
          {isUnread && <div className="w-2.5 h-2.5 rounded-full bg-primary-blue mt-2" />}
          {image && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-white/10 mt-auto mb-auto">
              <img src={image} alt="Match thumbnail" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
