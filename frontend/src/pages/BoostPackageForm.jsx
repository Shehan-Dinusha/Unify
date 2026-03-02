import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import { useBoostPackages } from '../context/BoostPackageContext';
import { mockRequests } from '../data/mockData';
import { CheckCircle2, Trash2, Plus, GripVertical, Eye, Info, LayoutDashboard, Settings, Save, AlertTriangle } from 'lucide-react';

const BoostPackageForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const { packages, addPackage, updatePackage } = useBoostPackages();

    // Find existing package if editing
    const existingPackage = isEditing
        ? packages.find((pkg) => pkg.id === id)
        : null;

    // Form state
    const [packageName, setPackageName] = useState('');
    const [price, setPrice] = useState('');
    const [durationValue, setDurationValue] = useState('24');
    const [durationUnit, setDurationUnit] = useState('Hours');
    const [badgeType, setBadgeType] = useState('No Badge');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState(['']);

    // Modal states
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);

    // Pre-fill form if editing
    useEffect(() => {
        if (existingPackage) {
            setPackageName(existingPackage.name);
            setPrice(String(existingPackage.price));
            setDurationValue(String(existingPackage.durationValue));
            setDurationUnit(existingPackage.durationUnit);
            setBadgeType(existingPackage.badge);
            setDescription(existingPackage.description);
            setFeatures(existingPackage.features);
        }
    }, [existingPackage]);

    const addFeature = () => {
        setFeatures([...features, '']);
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateFeatureText = (index, value) => {
        const updated = [...features];
        updated[index] = value;
        setFeatures(updated);
    };

    // Show save confirmation first
    const handleSaveClick = () => {
        setShowSaveConfirm(true);
    };

    // Actually save after confirmation
    const confirmSave = () => {
        setShowSaveConfirm(false);

        const pkgData = {
            name: packageName || 'Untitled',
            price: Number(price) || 0,
            duration: `${durationValue} ${durationUnit}`,
            durationValue: Number(durationValue) || 0,
            durationUnit,
            badge: badgeType,
            description: description || 'No description provided.',
            features: features.filter(f => f.trim() !== ''),
        };

        if (isEditing) {
            updatePackage(id, pkgData);
        } else {
            addPackage(pkgData);
        }

        const operationId = `#bst-${Math.floor(10000 + Math.random() * 90000)}-tf`;
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        setSuccessData({
            operationId,
            activationDate: `${dateStr} • ${timeStr}`,
            packageTier: packageName || 'Untitled',
            isEdit: isEditing,
        });
        setShowSuccess(true);
    };

    const cancelSave = () => {
        setShowSaveConfirm(false);
    };

    const handleDiscard = () => {
        navigate('/boost-controller');
    };

    // Duration options
    const durationUnitOptions = [
        { value: 'Hours', label: 'Hours' },
        { value: 'Days', label: 'Days' },
        { value: 'Weeks', label: 'Weeks' },
    ];

    const badgeOptions = [
        { value: 'No Badge', label: 'No Badge' },
        { value: 'Most Popular', label: 'Most Popular' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Best Value', label: 'Best Value' },
    ];

    // Live preview computed values
    const previewPrice = price ? `Rs. ${Number(price).toLocaleString()}` : 'Rs. 0';
    const previewDuration = `${durationValue} ${durationUnit}`;
    const previewFeatures = features.filter((f) => f.trim() !== '');



    return (
        <>
            {/* Save Confirmation Modal */}
            {showSaveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4">
                    <Card variant="card" padding="p-0" className="w-full max-w-[420px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl">
                        <div className="p-8 pb-6 flex flex-col items-center text-center">
                            {/* Confirm Icon */}
                            <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-primary-blue/5">
                                <Save size={32} className="text-primary-blue" />
                            </div>

                            <h2 className="text-xl font-bold text-white mb-3">
                                {isEditing ? 'Update Package?' : 'Save New Package?'}
                            </h2>
                            <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-sm">
                                {isEditing
                                    ? <>Are you sure you want to update the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? Changes will take effect immediately.</>
                                    : <>Are you sure you want to create the <span className="text-text-primary font-semibold">"{packageName || 'Untitled'}"</span> package? It will be available for businesses immediately.</>
                                }
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                            <button
                                onClick={confirmSave}
                                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                            >
                                <Save size={18} />
                                {isEditing ? 'Yes, Update Package' : 'Yes, Save Package'}
                            </button>
                            <button
                                onClick={cancelSave}
                                className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Success Modal - Scrollable to prevent cut-off */}
            {showSuccess && successData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
                    <Card variant="card" padding="p-0" className="w-full max-w-[480px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl my-auto">
                        <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
                            {/* Success Icon */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
                                <CheckCircle2 size={28} className="text-state-success sm:hidden" />
                                <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                                Package Successfully {successData.isEdit ? 'Updated' : 'Added'}
                            </h2>
                            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 max-w-sm">
                                The "{successData.packageTier}" boosting package has been
                                successfully {successData.isEdit ? 'applied to your active campaign' : 'added to your active campaign'}.
                                Your ad visibility will increase immediately.
                            </p>

                            {/* Details Card */}
                            <div className="w-full bg-white/5 rounded-2xl border border-white/10 p-md sm:p-lg mb-4 sm:mb-6">
                                <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                                    <span className="text-body-extra-small text-text-secondary font-inter">Operation ID</span>
                                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{successData.operationId}</span>
                                </div>
                                <div className="flex items-center justify-between py-xs sm:py-sm border-b border-white/10">
                                    <span className="text-body-extra-small text-text-secondary font-inter">Activation Date</span>
                                    <span className="text-body-extra-small sm:text-body-small-bold text-text-primary font-inter">{successData.activationDate}</span>
                                </div>
                                <div className="flex items-center justify-between py-xs sm:py-sm">
                                    <span className="text-body-extra-small text-text-secondary font-inter">Package Tier</span>
                                    <span className="text-body-extra-small sm:text-body-small-bold text-primary-blue font-inter flex items-center gap-1">
                                        <span>⚡</span> {successData.packageTier.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                            >
                                <LayoutDashboard size={18} />
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/boost-controller')}
                                className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
                            >
                                <Settings size={18} className="text-text-secondary" />
                                Manage All Packages
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            <MainLayout
                user={{ name: 'Alex Johnson', role: 'admin' }}
                pageTitle="Package Configuration"
                headerRight={null}
                verificationCount={mockRequests.length}
            >
                <div className="flex flex-col gap-lg">
                    {/* Page Title + Mobile Buttons */}
                    <div>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
                            <div>
                                <h1 className="text-heading-small text-text-primary font-inter">
                                    {isEditing ? 'Edit Boost Package' : 'Create New Boost Package'}
                                </h1>
                                <p className="text-body-small text-text-secondary font-inter mt-1">
                                    {isEditing
                                        ? `Modify details for the '${existingPackage?.name}' boost tier.`
                                        : 'Define a new advertising tier for businesses.'}
                                </p>
                            </div>
                            {/* Buttons — both desktop and mobile */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-sm md:gap-md w-full md:w-auto">
                                <Button variant="secondary" size="medium" onClick={handleDiscard} className="whitespace-nowrap">
                                    Discard Changes
                                </Button>
                                <Button variant="primary" size="medium" onClick={handleSaveClick} className="whitespace-nowrap">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Form + Preview */}
                    <div className="flex flex-col md:flex-row gap-lg">
                        {/* Left: Form */}
                        <div className="flex-1 min-w-0">
                            <Card variant="card" padding="p-lg">
                                <div className="flex flex-col gap-xl">
                                    {/* Package Details Section Header (Edit mode) */}
                                    {isEditing && (
                                        <h3 className="text-body-large-bold text-text-primary font-inter">Package Details</h3>
                                    )}

                                    {/* Row 1: Name + Badge/Price */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                        <Input
                                            label={isEditing ? 'PACKAGE NAME' : 'Package Title'}
                                            placeholder="eg : Campus Legend"
                                            value={packageName}
                                            onChange={(e) => setPackageName(e.target.value)}
                                        />
                                        {isEditing ? (
                                            <Input
                                                label="BADGE TAG"
                                                placeholder="Most Popular"
                                                value={badgeType}
                                                onChange={(e) => setBadgeType(e.target.value)}
                                            />
                                        ) : (
                                            <Input
                                                label="Price (LKR)"
                                                placeholder="Rs. 0.00"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Row 2: Duration + Badge/Price */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                                        {isEditing ? (
                                            <Input
                                                label="PRICE (LKR)"
                                                placeholder="Rs. 0.00"
                                                value={price ? `Rs. ${price}` : ''}
                                                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                                            />
                                        ) : (
                                            <Select
                                                label="Duration"
                                                value={durationValue === '24' && durationUnit === 'Hours' ? '24h' : `${durationValue}${durationUnit.charAt(0).toLowerCase()}`}
                                                options={[
                                                    { value: '24h', label: '24 Hours' },
                                                    { value: '3d', label: '3 Days' },
                                                    { value: '7d', label: '7 Days' },
                                                    { value: '14d', label: '14 Days' },
                                                    { value: '30d', label: '30 Days' },
                                                ]}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '24h') { setDurationValue('24'); setDurationUnit('Hours'); }
                                                    else if (val === '3d') { setDurationValue('3'); setDurationUnit('Days'); }
                                                    else if (val === '7d') { setDurationValue('7'); setDurationUnit('Days'); }
                                                    else if (val === '14d') { setDurationValue('14'); setDurationUnit('Days'); }
                                                    else if (val === '30d') { setDurationValue('30'); setDurationUnit('Days'); }
                                                }}
                                            />
                                        )}
                                        {isEditing ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                                <Input
                                                    label="DURATION"
                                                    placeholder="3"
                                                    value={durationValue}
                                                    onChange={(e) => setDurationValue(e.target.value)}
                                                />
                                                <Select
                                                    label={'\u00A0'}
                                                    value={durationUnit}
                                                    options={durationUnitOptions}
                                                    onChange={(e) => setDurationUnit(e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <Select
                                                label="Badge Type"
                                                value={badgeType}
                                                options={badgeOptions}
                                                onChange={(e) => setBadgeType(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {/* Description (Edit mode) */}
                                    {isEditing && (
                                        <div className="flex flex-col gap-1.5 w-full">
                                            <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
                                                DESCRIPTION
                                            </label>
                                            <textarea
                                                className="w-full h-20 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all font-inter text-sm text-text-primary placeholder:text-text-tertiary px-4 py-3 resize-none focus:border-primary-blue/50 focus:bg-white/10 shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]"
                                                placeholder="Describe this package..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {/* Features Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-md">
                                            <h4 className="text-body-medium-bold text-text-primary font-inter">
                                                {isEditing ? 'Benefits & Features' : 'Key Benefits & Features'}
                                            </h4>
                                            <button
                                                onClick={addFeature}
                                                className="flex items-center gap-xs text-primary-blue text-body-small-bold font-inter hover:underline transition-all"
                                            >
                                                <Plus size={16} />
                                                Add Feature
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-sm">
                                            {features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-sm">
                                                    {isEditing && (
                                                        <GripVertical size={18} className="text-text-secondary flex-shrink-0 cursor-grab" />
                                                    )}
                                                    {!isEditing && (
                                                        <CheckCircle2 size={18} className="text-text-secondary flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center px-4 transition-all focus-within:border-primary-blue/50 focus-within:bg-white/10">
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary font-inter"
                                                            placeholder="Add a new feature..."
                                                            value={feature}
                                                            onChange={(e) => updateFeatureText(index, e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => removeFeature(index)}
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-state-error/70 hover:bg-state-error/10 hover:text-state-error transition-all flex-shrink-0"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right: Live Preview */}
                        <div className="w-full md:w-80 flex-shrink-0">
                            <div className="sticky top-24 flex flex-col gap-md">
                                {/* Preview Header */}
                                <div className="flex items-center gap-sm">
                                    <Eye size={18} className="text-primary-blue" />
                                    <span className="text-body-medium-bold text-text-primary font-inter">
                                        {isEditing ? 'LIVE PREVIEW' : 'Card Preview'}
                                    </span>
                                </div>

                                {/* Preview Card */}
                                <div className="rounded-2xl border-2 border-primary-blue/60 bg-gradient-to-b from-white/10 to-white/5 p-lg">
                                    <div className="flex flex-col gap-sm">
                                        <h3 className="text-body-large-bold text-primary-blue font-inter">
                                            {packageName || 'Campus Legend'}
                                        </h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-heading-small text-text-primary font-inter font-bold">
                                                {previewPrice}
                                            </span>
                                            <span className="text-body-extra-small text-text-secondary font-inter">/ {previewDuration}</span>
                                        </div>
                                        <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed">
                                            {description || (isEditing
                                                ? 'Best balance of reach and duration for weekly promos.'
                                                : 'Dominate the university feed with maximum visibility and engagement.')}
                                        </p>
                                        <div className="flex flex-col gap-xs mt-sm">
                                            {previewFeatures.length > 0 ? (
                                                previewFeatures.map((f, i) => (
                                                    <div key={i} className="flex items-center gap-xs">
                                                        <CheckCircle2 size={14} className="text-state-success flex-shrink-0" />
                                                        <span className="text-body-small text-text-primary font-inter">{f}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-xs">
                                                        <CheckCircle2 size={14} className="text-state-success" />
                                                        <span className="text-body-small text-text-primary font-inter">Priority feed placement</span>
                                                    </div>
                                                    <div className="flex items-center gap-xs">
                                                        <CheckCircle2 size={14} className="text-state-success" />
                                                        <span className="text-body-small text-text-primary font-inter">Reach 5,000+ students</span>
                                                    </div>
                                                    <div className="flex items-center gap-xs">
                                                        <CheckCircle2 size={14} className="text-state-success" />
                                                        <span className="text-body-small text-text-primary font-inter">Verified sponsor badge</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <Button variant="primary" size="small" fullWidth className="mt-md">
                                            Select {packageName || 'Package'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Tip Card */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 p-md">
                                    <div className="flex items-start gap-sm">
                                        <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Info size={16} className="text-primary-blue" />
                                        </div>
                                        <div>
                                            <p className="text-body-small-bold text-text-primary font-inter mb-xs">
                                                {isEditing ? 'Editing Tips' : 'Visibility Tip'}
                                            </p>
                                            <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed">
                                                {isEditing
                                                    ? 'Changes made here will take effect immediately for all new purchases. Existing active boosts will retain their original parameters until expiry.'
                                                    : 'This preview shows exactly how business accounts will see this package in their dashboard selection screen.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
};

export default BoostPackageForm;
