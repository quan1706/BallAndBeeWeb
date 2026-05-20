import { MapPin, Phone, MessageCircle, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { companyInfo } from '../data/mockData';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading text-4xl text-center text-[#1E3A5F] mb-12">Liên hệ với chúng tôi</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-xs uppercase tracking-widest text-[#C8954A] mb-6">
              Thông tin liên hệ
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <MapPin className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Địa chỉ</p>
                  <p className="font-medium">{companyInfo.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <Phone className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Số điện thoại</p>
                  <a href={`tel:${companyInfo.phone}`} className="font-medium hover:text-[#C8954A]">
                    {companyInfo.phone}
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
                    href={`https://zalo.me/${companyInfo.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-[#C8954A]"
                  >
                    {companyInfo.zalo}
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
                    href={`mailto:${companyInfo.email}`}
                    className="font-medium hover:text-[#C8954A]"
                  >
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[#FAF7F2] rounded-lg">
                  <Clock className="w-5 h-5 text-[#C8954A]" />
                </div>
                <div>
                  <p className="text-sm text-[#888888] mb-1">Giờ làm việc</p>
                  <p className="font-medium">{companyInfo.hours}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E8E0D5] pt-6">
              <p className="text-sm text-[#888888] mb-4">Kết nối với chúng tôi</p>
              <div className="flex gap-3">
                <a
                  href={companyInfo.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={companyInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={companyInfo.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center hover:bg-[#C8954A] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="border-t border-[#E8E0D5] mt-6 pt-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.8983128073786!2d108.21992687589745!3d16.072661884621964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c8b5cf238f%3A0x69a4f8e9eae7ec0f!2zxJDDoCBO4bq1bmcsIFZp4buHdCBOYW0!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-xs uppercase tracking-widest text-[#C8954A] mb-6">Gửi tin nhắn</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                <label className="block text-sm font-medium mb-2">
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
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nội dung</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E0D5] focus:border-[#C8954A] focus:ring-2 focus:ring-[#C8954A]/20 outline-none transition-all resize-none"
                  placeholder="Nhập nội dung tin nhắn"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#C8954A] text-white py-3 rounded-lg hover:bg-[#B8854A] transition-colors font-medium"
              >
                Gửi ngay
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
