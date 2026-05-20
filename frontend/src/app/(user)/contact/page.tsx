'use client';

import { MapPin, Phone, MessageCircle, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { companyInfo } from '@/lib/constants';
import { useState } from 'react';
import { useSettings, useSubmitContactMessage } from '@/lib/api';

export default function ContactPage() {
  const { data: settings } = useSettings();
  const submitContactMutation = useSubmitContactMessage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMutation.mutate(formData, {
      onSuccess: () => {
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
        setFormData({ name: '', phone: '', email: '', message: '' });
      },
      onError: (err) => {
        alert('Có lỗi xảy ra khi gửi liên hệ: ' + err.message);
      },
    });
  };

  // Safe fallback values
  const address = settings?.address || companyInfo.address;
  const phone = settings?.phone || companyInfo.phone;
  const zalo = settings?.zalo || companyInfo.zalo;
  const email = settings?.email || companyInfo.email;
  const hours = settings?.hours || companyInfo.hours;
  
  const facebook = settings?.facebook || companyInfo.social.facebook;
  const instagram = settings?.instagram || companyInfo.social.instagram;
  const tiktok = settings?.tiktok || companyInfo.social.tiktok;

  const getMapSrc = (embedCode: string) => {
    if (!embedCode) return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s';
    if (embedCode.startsWith('http')) return embedCode;
    const match = embedCode.match(/src="([^"]+)"/);
    return match ? match[1] : embedCode;
  };
  const mapSrc = getMapSrc(settings?.googleMapsEmbed || '');

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading text-4xl text-center text-[#1E3A5F] mb-12">Liên hệ với chúng tôi</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E0D5]/50">
            <p className="text-xs uppercase tracking-widest text-[#C8954A] mb-6 font-semibold">
              Thông tin liên hệ
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Địa chỉ</p>
                  <p className="font-medium text-gray-800">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <Phone className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Số điện thoại</p>
                  <a href={`tel:${phone}`} className="font-medium text-gray-800 hover:text-[#C8954A] transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Zalo</p>
                  <a
                    href={`https://zalo.me/${zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-800 hover:text-[#C8954A] transition-colors"
                  >
                    {zalo}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <Mail className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-gray-800 hover:text-[#C8954A] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <Clock className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Giờ làm việc</p>
                  <p className="font-medium text-gray-800">{hours}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E8E0D5] pt-6">
              <p className="text-sm text-[#888888] mb-4">Kết nối với chúng tôi</p>
              <div className="flex gap-3">
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {mapSrc && (
              <div className="border-t border-[#E8E0D5] mt-6 pt-6 rounded-lg overflow-hidden">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-[#E8E0D5]/50">
            <p className="text-xs uppercase tracking-widest text-[#C8954A] mb-6 font-semibold">Gửi tin nhắn</p>

            <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1E3A5F]">Nội dung <span className="text-red-500">*</span></label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all resize-none"
                  placeholder="Nhập nội dung tin nhắn"
                />
              </div>

              <button
                type="submit"
                disabled={submitContactMutation.isPending}
                className="w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] disabled:bg-[#C8954A]/60 disabled:cursor-not-allowed transition-colors font-semibold cursor-pointer"
              >
                {submitContactMutation.isPending ? 'Đang gửi...' : 'Gửi ngay'}
              </button>

              <p className="text-sm text-[#888888] text-center">
                Chúng tôi sẽ phản hồi trong vòng 24 giờ
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
