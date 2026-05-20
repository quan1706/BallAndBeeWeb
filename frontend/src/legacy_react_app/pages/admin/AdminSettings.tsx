import { useState } from 'react';
import { companyInfo } from '../../data/mockData';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'map'>('company');

  const tabs = [
    { id: 'company', label: 'Thông tin công ty' },
    { id: 'contact', label: 'Liên hệ & Mạng xã hội' },
    { id: 'map', label: 'Google Map' },
  ] as const;

  return (
    <div className="max-w-4xl">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg shadow-sm p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#C8954A] text-white'
                : 'text-[#888888] hover:bg-[#FAF7F2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-[#FAF7F2] rounded-lg flex items-center justify-center text-2xl heading text-[#C8954A]">
                  B&B
                </div>
                <button className="px-4 py-2 border-2 border-[#C8954A] text-[#C8954A] rounded-lg hover:bg-[#C8954A] hover:text-white">
                  Thay đổi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tên công ty</label>
              <input
                type="text"
                defaultValue={companyInfo.name}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slogan</label>
              <input
                type="text"
                defaultValue={companyInfo.tagline}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Giới thiệu ngắn</label>
              <textarea
                rows={4}
                defaultValue={companyInfo.description}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">📞 Số điện thoại</label>
                <input
                  type="tel"
                  defaultValue={companyInfo.phone}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">💬 Zalo</label>
                <input
                  type="tel"
                  defaultValue={companyInfo.zalo}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📧 Email</label>
              <input
                type="email"
                defaultValue={companyInfo.email}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">📍 Địa chỉ</label>
              <input
                type="text"
                defaultValue={companyInfo.address}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">🕐 Giờ làm việc</label>
              <input
                type="text"
                defaultValue={companyInfo.hours}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
              />
            </div>

            <div className="border-t border-[#E8E0D5] pt-6">
              <h4 className="font-medium text-[#1E3A5F] mb-4">Mạng xã hội</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Facebook URL</label>
                  <input
                    type="url"
                    defaultValue={companyInfo.social.facebook}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Instagram URL</label>
                  <input
                    type="url"
                    defaultValue={companyInfo.social.instagram}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">TikTok URL</label>
                  <input
                    type="url"
                    defaultValue={companyInfo.social.tiktok}
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Google Maps Embed Code</label>
              <textarea
                rows={6}
                placeholder='<iframe src="..." width="600" height="450"...></iframe>'
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] outline-none resize-none font-mono text-sm"
              />
              <p className="text-xs text-[#888888] mt-2">
                Lấy code tại Google Maps → Chia sẻ → Nhúng bản đồ
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Xem trước</label>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-3 bg-[#C8954A] text-white rounded-lg hover:bg-[#B8854A]">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
