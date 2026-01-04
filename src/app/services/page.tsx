"use client";
import React from "react";
import Link from "next/link";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import styles from "../../styles/ServicesPage.module.css";
import SEO from "../../components/SEO";

const ServicesPage = () => {
  const services = [
    {
      href: "/job-application",
      label: "طلب توظيف",
      external: false,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/Login",
      label: "التصديق الإلكتروني",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/DocumentVerify",
      label: "التحقق من الوثائق",
      external: true,
    },
    {
      href: "https://www.coccertificate.org/#/",
      label: "التحقق وطباعة شهادة الاشتراكات",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/Contact",
      label: "تحديث البيانات",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/MemberIdQuery/false",
      label: "الاستعلام عن عضوية",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/MemberIdQuery/true",
      label: "الاستعلام عن منتسب",
      external: true,
    },
    {
      href: "https://www.sdb.gov.sa/ar/تمويل-المنشات/تمويل-رواد-الاعمال",
      label: "قنوف لتمويل رواد الاعمال",
      external: true,
    },
    {
      href: "https://bishacci.org.sa/?page_id=11593",
      label: "مبادرة حلول لتحديات قطاع الاعمال",
      external: true,
    },
    {
      href: "/membership-card",
      label: "بطاقة مزايا العضوية للمشتركين",
      external: true,
    },
    {
      href: "https://eservices.bishacci.org.sa/#/CommericalManual",
      label: "الدليل التجاري",
      external: true,
    },
    {
      href: "https://bishacci.org.sa/?page_id=14839",
      label: "مركز ريادة الاعمال الرقمي",
      external: true,
    },

    {
      href: "https://business.sa/eservices/details/e95ddf0f-41c3-4a72-d307-08dd92bf74b8",
      label: "تجديد الاشتراك",
      external: true,
    },
    {
      href: "https://numo.sa/ar/b/fraa-bysh",
      label: "التدريب",
      external: true,
    },
    {
      href: "/contact",
      label: "الشكاوي والاقتراحات",
      external: true,
    },
    {
      href: "/voting-auth",
      label: "الجمعية العمومية",
      external: true,
    },
  ];

  return (
    <>
      <SEO
        title="خدماتنا | غرفة بيشة التجارية"
        description="جميع الخدمات الإلكترونية المتاحة من غرفة بيشة التجارية - التصديق الإلكتروني، التحقق من الوثائق، طلب توظيف، بطاقة مزايا، والمزيد"
        keywords={[
          "خدمات غرفة بيشة",
          "التصديق الإلكتروني",
          "التحقق من الوثائق",
          "طلب توظيف",
          "بطاقة مزايا",
        ]}
        canonicalUrl="https://bishacci.org.sa/services"
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            <FaArrowRight />
            العودة للرئيسية
          </Link>
          <h1 className={styles.title}>خدماتنا</h1>
          <p className={styles.subtitle}>جميع الخدمات الإلكترونية المتاحة</p>
        </div>

        <div className={styles.servicesList}>
          {services.map((service, index) =>
            service.external ? (
              <a
                key={index}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.serviceItem}
              >
                <span className={styles.serviceLabel}>{service.label}</span>
                <FaExternalLinkAlt className={styles.externalIcon} />
              </a>
            ) : (
              <Link
                key={index}
                href={service.href}
                className={styles.serviceItem}
              >
                <span className={styles.serviceLabel}>{service.label}</span>
                <FaArrowRight className={styles.arrowIcon} />
              </Link>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;
