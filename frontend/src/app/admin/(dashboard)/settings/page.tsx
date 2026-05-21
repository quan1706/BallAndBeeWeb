'use client';

import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/lib/api';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'map'>('company');
  const { data: settings, isLoading, isError } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [formData, setFormData] = useState<{
    id?: any;
    name: string;
    tagline: string;
    description: string;
    phone: string;
    zalo: string;
    email: string;
    address: string;
    hours: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    googleMapsEmbed: string;
  }>({
    name: '',
    tagline: '',
    description: '',
    phone: '',
    zalo: '',
    email: '',
    address: '',
    hours: '',
    facebook: '',
    instagram: '',
    tiktok: '',
    googleMapsEmbed: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        id: settings.id, // Quan trọng: giữ lại id để update đúng bản ghi
        name: settings.name || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        phone: settings.phone || '',
        zalo: settings.zalo || '',
        email: settings.email || '',
        address: settings.address || '',
        hours: settings.hours || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        tiktok: settings.tiktok || '',
        googleMapsEmbed: settings.googleMapsEmbed || '',
      });
    }
  }, [settings]);

  const tabs = [
    { id: 'company', label: 'Thông tin công ty' },
    { id: 'contact', label: 'Liên hệ & Mạng xã hội' },
    { id: 'map', label: 'Google Map' },
  ] as const;

  const handleSave = () => {
    if (!formData.id) {
      alert('Không tìm thấy cài đặt hệ thống! Vui lòng tải lại trang.');
      return;
    }
    updateSettingsMutation.mutate(formData as any, {
      onSuccess: () => {
        alert('✅ Lưu thay đổi thành công!');
      },
      onError: (err) => {
        alert('❌ Có lỗi xảy ra: ' + err.message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8954A]" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <p className="font-semibold text-red-700 text-lg">Không thể tải cài đặt hệ thống</p>
          <p className="text-sm text-gray-500 mt-1">Bảng <code className="bg-gray-100 px-1 rounded">system_settings</code> chưa có dữ liệu hoặc bị chặn bởi RLS.</p>
          <p className="text-xs text-gray-400 mt-2">Vui lòng kiểm tra Supabase Dashboard hoặc chạy lại script seed.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#C8954A] text-white rounded-lg text-sm font-semibold hover:bg-[#B8854A] transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Extract source from iframe code for preview
  const getMapSrc = (embedCode: string) => {
    if (!embedCode) return '';
    if (embedCode.startsWith('http')) return embedCode;
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : '';
  };

  const previewSrc = getMapSrc(formData.googleMapsEmbed);

  return (
    <div className="max-w-4xl text-gray-800">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg shadow-sm p-1 border border-[#E8E0D5]/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#C8954A] text-white shadow-sm'
                : 'text-[#888888] hover:bg-[#FAF7F2] hover:text-[#1E3A5F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-[#FAF7F2] rounded-lg flex items-center justify-center text-2xl heading text-[#C8954A] border border-[#E8E0D5]/50 font-bold shadow-sm">
                  B&B
                </div>
                <button className="px-4 py-2 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white transition-all font-semibold cursor-pointer">
                  Thay đổi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Tên công ty</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Slogan</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Giới thiệu ngắn</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none resize-none transition-all"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
                className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] disabled:bg-[#C8954A]/60 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
              >
                {updateSettingsMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">📞 Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">💬 Zalo</label>
                <input
                  type="tel"
                  value={formData.zalo}
                  onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">📧 Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">📍 Địa chỉ</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">🕐 Giờ làm việc</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
              />
            </div>

            <div className="border-t border-[#E8E0D5] pt-6">
              <h4 className="font-semibold text-[#1E3A5F] mb-4 text-base">Mạng xã hội</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Instagram URL</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">TikTok URL</label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
                className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] disabled:bg-[#C8954A]/60 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
              >
                {updateSettingsMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-[#E8E0D5]/30">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Google Maps Embed Code (hoặc Url nhúng)</label>
              <textarea
                rows={6}
                value={formData.googleMapsEmbed}
                onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
                placeholder='<iframe src="..." width="600" height="450"...></iframe>'
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none resize-none font-mono text-sm"
              />
              <p className="text-xs text-[#888888] mt-2 font-medium">
                Lấy code tại Google Maps → Chia sẻ → Nhúng bản đồ, hoặc dán trực tiếp đường dẫn src.
              </p>
            </div>

            {previewSrc && (
              <div>
                <label className="block text-sm font-medium mb-3 text-[#1E3A5F]">Xem trước</label>
                <div className="rounded-lg overflow-hidden border border-[#E8E0D5]/50">
                  <iframe
                    src={previewSrc}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={updateSettingsMutation.isPending}
                className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A] disabled:bg-[#C8954A]/60 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
              >
                {updateSettingsMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
