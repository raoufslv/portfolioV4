import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import SectionHeader from './common/SectionHeader';
import emailjs from '@emailjs/browser';

interface FormData {
  name: string;
  email: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      const response = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_USER_ID
      );

      if (response.status === 200) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('EmailJS error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFormStatus('error');
      setErrorMessage(t('contact.error'));
    }
  };


  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
      label: 'Email',
      value: 'devcode.raouf@gmail.com',
      href: 'mailto:devcode.raouf@gmail.com'
    },
    {
      icon: <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
      label: 'Phone',
      value: '+33 7 69 35 31 22',
      href: 'tel:+33769353122'
    },
    {
      icon: <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
      label: 'Location',
      value: 'Le Havre, France',
      href: 'https://maps.google.com/?q=Le+Havre+France'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const renderFormStatusMessage = () => {
    if (formStatus === 'success') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-4 text-sm rounded-md bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 mb-4"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          {t('contact.success')}
        </motion.div>
      );
    } else if (formStatus === 'error') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center p-4 text-sm rounded-md bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400 mb-4"
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorMessage}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <section id="contact" className="py-20 bg-light-200 dark:bg-dark-500">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-section">
        <SectionHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12"
        >
          {/* Contact Form */}
          <motion.div variants={itemVariants} className="order-2 lg:order-1">
            {renderFormStatusMessage()}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  {t('contact.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  required
                  disabled={formStatus === 'submitting'}
                  className="w-full px-4 py-3 bg-light-100 dark:bg-dark-600 border border-light-300 dark:border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-70"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  {t('contact.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.emailPlaceholder')}
                  required
                  disabled={formStatus === 'submitting'}
                  className="w-full px-4 py-3 bg-light-100 dark:bg-dark-600 border border-light-300 dark:border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-70"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  {t('contact.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                  required
                  disabled={formStatus === 'submitting'}
                  rows={5}
                  className="w-full px-4 py-3 bg-light-100 dark:bg-dark-600 border border-light-300 dark:border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 disabled:opacity-70 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('contact.send')}...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    {t('contact.send')}
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="order-1 lg:order-2">
            <div className="bg-light-100 dark:bg-dark-600 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary-50 dark:bg-primary-900/10 rounded-full">
                        {info.icon}
                      </div>
                    </div>

                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-dark-400 dark:text-light-300">
                        {info.label}
                      </h4>
                      <a
                        href={info.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <iframe
                  title="Location Map"
                  className="w-full h-64 rounded-lg border-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999123456789!2d0.1234567890123456!3d49.1234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e9b12345678901%3A0x1234567890123456!2sLe%20Havre%2C%20France!5e0!3m2!1sen!2sus!4v1612345678901"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;