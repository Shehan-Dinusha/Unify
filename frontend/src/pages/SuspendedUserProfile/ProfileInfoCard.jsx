import React from 'react';
import Card from '../../components/common/Card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getAvatarUrl } from '../../utils/formatters';

const ProfileInfoCard = ({ user, suspension }) => (
    <Card variant="card" padding="p-0">
        <div className="p-lg">
            <div className="flex flex-col items-center text-center mb-lg">
                <div className="relative mb-md">
                    <img
                        src={getAvatarUrl(user.avatar, user.name)}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                    />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-state-error text-white text-[10px] font-bold font-inter px-2 py-0.5 rounded uppercase tracking-wider">
                        {suspension.status === 'REACTIVATED' ? 'Restored' : 'Suspended'}
                    </span>
                </div>
                <h2 className="text-heading-small text-text-primary font-inter">{user.name || 'Unknown User'}</h2>
                <p className="text-body-small text-text-secondary font-inter">
                    {user.role === 'Business' ? 'Business ID' : 'Student ID'}: {user.studentId || '\u2014'}
                </p>
            </div>

            <div className="border-t border-white/10">
                <div className="flex items-center justify-between py-md border-b border-white/5">
                    <span className="text-body-small text-text-secondary font-inter">{user.role === 'Business' ? 'Category' : 'Faculty'}</span>
                    <span className="text-body-small-bold text-text-primary font-inter">{user.faculty || '\u2014'}</span>
                </div>
                <div className="flex items-center justify-between py-md border-b border-white/5">
                    <span className="text-body-small text-text-secondary font-inter">{user.role === 'Business' ? 'Business Owner' : 'Department'}</span>
                    <span className="text-body-small-bold text-text-primary font-inter">{user.department || '\u2014'}</span>
                </div>
                <div className="flex items-center justify-between py-md border-b border-white/5">
                    <span className="text-body-small text-text-secondary font-inter">{user.role === 'Business' ? 'NIC Number' : 'Year'}</span>
                    <span className="text-body-small-bold text-text-primary font-inter">{user.year || '\u2014'}</span>
                </div>
                <div className="flex items-center justify-between py-md">
                    <span className="text-body-small text-text-secondary font-inter">{user.role === 'Business' ? 'Average Rating' : 'GPA'}</span>
                    <span className="text-body-small-bold text-text-primary font-inter">
                        {user.gpa || '\u2014'}
                        {user.role === 'Business' && user.gpa && ' / 5.0'}
                    </span>
                </div>
            </div>

            <div className="mt-lg rounded-2xl bg-white/5 border border-white/10 p-lg">
                <h4 className="text-body-medium-bold text-text-primary font-inter mb-md">Contact Information</h4>
                <div className="flex flex-col gap-md">
                    <div className="flex items-center gap-md">
                        <Mail size={16} className="text-text-secondary shrink-0" />
                        <span className="text-body-small text-text-secondary font-inter truncate">{user.email || '\u2014'}</span>
                    </div>
                    <div className="flex items-center gap-md">
                        <Phone size={16} className="text-text-secondary shrink-0" />
                        <span className="text-body-small text-text-secondary font-inter">{user.phone || '\u2014'}</span>
                    </div>
                    <div className="flex items-center gap-md">
                        <MapPin size={16} className="text-text-secondary shrink-0" />
                        <span className="text-body-small text-text-secondary font-inter">{user.address || '\u2014'}</span>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

export default ProfileInfoCard;
