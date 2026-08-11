/* =====================================================
   Entekhab Nik
   Request Form - New 5 Step Version
   Connected to Google Apps Script
===================================================== */

"use strict";


// =====================================================
// آدرس Google Apps Script
// =====================================================

const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwSw_827fYRoVidZR8nm11zka1c7IA83BR6g-R4dLBWi21hV2-RnwhmnsJKEJyc3Q/exec";


// =====================================================
// اطلاعات درخواست
// =====================================================

const requestData = {

    service: "",
    serviceName: "",

    location: {
        region: "",
        address: ""
    },

    schedule: {
        date: "",
        time: "",
        description: ""
    },

    customer: {
        name: "",
        mobile: ""
    },

    details: {}

};


// =====================================================
// مرحله فعلی
// =====================================================

let currentStep = 1;


// =====================================================
// انتخاب عناصر
// =====================================================

const pages =
    document.querySelectorAll(
        ".request-page"
    );


// =====================================================
// نمایش مرحله
// =====================================================

function showStep(step) {

    pages.forEach(function(page) {

        page.classList.remove("active");

    });


    const target =
        document.getElementById(
            "request-page-" + step
        );


    if (!target) {

        console.warn(
            "مرحله پیدا نشد:",
            step
        );

        return;

    }


    target.classList.add("active");

    currentStep = step;


    updateProgress();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// به‌روزرسانی نوار مراحل
// =====================================================

function updateProgress() {

    const steps =
        document.querySelectorAll(
            ".progress-step"
        );


    steps.forEach(function(step) {

        const number =
            Number(
                step.dataset.step
            );


        step.classList.remove(
            "active",
            "completed"
        );


        if (number === currentStep) {

            step.classList.add(
                "active"
            );

        }


        if (number < currentStep) {

            step.classList.add(
                "completed"
            );

        }

    });

}


// =====================================================
// گرفتن مقدار یک عنصر
// =====================================================

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value.trim();

}


// =====================================================
// تنظیم مقدار یک عنصر
// =====================================================

function setValue(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.value =
        value || "";

}


// =====================================================
// گرفتن مقدار Select
// =====================================================

function getSelectValue(id) {

    return getValue(id);

}


// =====================================================
// نمایش فقط جزئیات خدمت انتخاب‌شده
// =====================================================

function showServiceDetails(service) {

    const details =
        document.querySelectorAll(
            ".service-details"
        );


    details.forEach(function(item) {

        item.style.display = "none";

    });


    const selected =
        document.getElementById(
            "details-" + service
        );


    if (selected) {

        selected.style.display =
            "block";

    }

}


// =====================================================
// انتخاب نام خدمت
// =====================================================

function getServiceName(service) {

    const names = {

        stairs:
            "نظافت راه‌پله و پارکینگ",

        home:
            "نظافت منزل",

        office:
            "نظافت اداره",

        event:
            "خدمات مراسم و پذیرایی",

        other:
            "سایر موارد"

    };


    return names[service] || "";

}


// =====================================================
// بررسی شماره موبایل
// =====================================================

function isValidMobile(mobile) {

    const normalized =
        mobile
            .replace(/\s/g, "")
            .replace(/-/g, "");


    return /^09\d{9}$/.test(
        normalized
    );

}


// =====================================================
// آماده‌سازی اولیه فرم
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showStep(1);


        showServiceDetails(
            ""
        );

    }
);


// =====================================================
// انتخاب خدمت - مرحله ۱
// =====================================================

const serviceSelect =
    document.getElementById(
        "service-select"
    );


// =====================================================
// دکمه مرحله بعد از انتخاب خدمت
// =====================================================

const nextStep1 =
    document.getElementById(
        "next-step-1"
    );


if (nextStep1) {

    nextStep1.addEventListener(
        "click",
        function () {

            const service =
                getSelectValue(
                    "service-select"
                );


            if (!service) {

                alert(
                    "لطفاً نوع خدمت موردنظر خود را انتخاب کنید."
                );

                return;

            }


            requestData.service =
                service;


            requestData.serviceName =
                getServiceName(
                    service
                );


            showServiceDetails(
                service
            );


            showStep(2);

        }
    );

}


// =====================================================
// دکمه برگشت مرحله دوم
// =====================================================

const backStep2 =
    document.getElementById(
        "back-step-2"
    );


if (backStep2) {

    backStep2.addEventListener(
        "click",
        function () {

            showStep(1);

        }
    );

}


// =====================================================
// دکمه مرحله بعد مرحله دوم
// اطلاعات محل انجام خدمات
// =====================================================

const nextStep2 =
    document.getElementById(
        "next-step-2"
    );


if (nextStep2) {

    nextStep2.addEventListener(
        "click",
        function () {

            const region =
                getValue(
                    "customer-region"
                );


            const address =
                getValue(
                    "customer-address"
                );


            if (!region) {

                alert(
                    "لطفاً منطقه یا محدوده را وارد کنید."
                );

                return;

            }


            if (!address) {

                alert(
                    "لطفاً آدرس دقیق محل انجام خدمات را وارد کنید."
                );

                return;

            }


            requestData.location.region =
                region;


            requestData.location.address =
                address;


            showStep(3);

        }
    );

}


// =====================================================
// مرحله ۳ - جزئیات خدمت
// =====================================================

const backStep3 =
    document.getElementById(
        "back-step-3"
    );


if (backStep3) {

    backStep3.addEventListener(
        "click",
        function () {

            showStep(2);

        }
    );

}


// =====================================================
// ذخیره جزئیات راه‌پله و پارکینگ
// =====================================================

function saveStairsDetails() {

    requestData.details = {

        type:
            getSelectValue(
                "stairs-type"
            ),

        floors:
            getValue(
                "stairs-floors"
            ),

        units:
            getValue(
                "stairs-units"
            ),

        entrances:
            getValue(
                "stairs-entrances"
            ),

        elevator:
            getSelectValue(
                "stairs-elevator"
            ),

        ladder:
            getSelectValue(
                "stairs-ladder"
            ),

        description:
            getValue(
                "stairs-description"
            )

    };

}


// =====================================================
// ذخیره جزئیات منزل
// =====================================================

function saveHomeDetails() {

    requestData.details = {

        status:
            getSelectValue(
                "home-status"
            ),

        area:
            getValue(
                "home-area"
            ),

        rooms:
            getValue(
                "home-rooms"
            ),

        toilets:
            getValue(
                "home-toilets"
            ),

        bathrooms:
            getValue(
                "home-bathrooms"
            ),

        ladder:
            getSelectValue(
                "home-ladder"
            ),

        pet:
            getSelectValue(
                "home-pet"
            ),

        description:
            getValue(
                "home-description"
            )

    };

}


// =====================================================
// ذخیره جزئیات اداره
// =====================================================

function saveOfficeDetails() {

    requestData.details = {

        type:
            getSelectValue(
                "office-type"
            ),

        area:
            getValue(
                "office-area"
            ),

        rooms:
            getValue(
                "office-rooms"
            ),

        floors:
            getValue(
                "office-floors"
            ),

        staff:
            getValue(
                "office-staff"
            ),

        ladder:
            getSelectValue(
                "office-ladder"
            ),

        description:
            getValue(
                "office-description"
            )

    };

}


// =====================================================
// ذخیره جزئیات مراسم
// =====================================================

function saveEventDetails() {

    requestData.details = {

        type:
            getSelectValue(
                "event-type"
            ),

        guests:
            getValue(
                "event-guests"
            ),

        staff:
            getValue(
                "event-staff"
            ),

        gender:
            getSelectValue(
                "event-gender"
            ),

        description:
            getValue(
                "event-description"
            )

    };

}


// =====================================================
// ذخیره سایر موارد
// =====================================================

function saveOtherDetails() {

    requestData.details = {

        title:
            getValue(
                "other-title"
            ),

        description:
            getValue(
                "other-description"
            )

    };

}


// =====================================================
// بررسی و ذخیره مرحله ۳
// =====================================================

function saveCurrentServiceDetails() {

    switch (
        requestData.service
    ) {

        case "stairs":

            saveStairsDetails();

            break;


        case "home":

            saveHomeDetails();

            break;


        case "office":

            saveOfficeDetails();

            break;


        case "event":

            saveEventDetails();

            break;


        case "other":

            saveOtherDetails();

            break;


        default:

            alert(
                "نوع خدمت مشخص نیست."
            );

            return false;

    }


    return true;

}


// =====================================================
// دکمه مرحله بعد از جزئیات
// =====================================================

const nextStep3 =
    document.getElementById(
        "next-step-3"
    );


if (nextStep3) {

    nextStep3.addEventListener(
        "click",
        function () {

            if (
                !saveCurrentServiceDetails()
            ) {

                return;

            }


            showStep(4);

        }
    );

}


// =====================================================
// مرحله ۴ - زمان انجام خدمات
// =====================================================

const backStep4 =
    document.getElementById(
        "back-step-4"
    );


if (backStep4) {

    backStep4.addEventListener(
        "click",
        function () {

            showStep(3);

        }
    );

}


// =====================================================
// دکمه مرحله بعد مرحله ۴
// =====================================================

const nextStep4 =
    document.getElementById(
        "next-step-4"
    );


if (nextStep4) {

    nextStep4.addEventListener(
        "click",
        function () {

            const date =
                getValue(
                    "service-date"
                );


            const time =
                getValue(
                    "service-time"
                );


            const description =
                getValue(
                    "service-description"
                );


            if (!date) {

                alert(
                    "لطفاً تاریخ موردنظر را وارد کنید."
                );

                return;

            }


            if (!time) {

                alert(
                    "لطفاً ساعت موردنظر را وارد کنید."
                );

                return;

            }


            requestData.schedule.date =
                date;


            requestData.schedule.time =
                time;


            requestData.schedule.description =
                description;


            showStep(5);


            buildFinalSummary();

        }
    );

}


// =====================================================
// مرحله ۵ - خلاصه درخواست
// =====================================================

function buildFinalSummary() {

    const summary =
        document.getElementById(
            "final-summary"
        );


    if (!summary) {
        return;
    }


    const details =
        requestData.details || {};


    let detailsHtml = "";


    Object.keys(details).forEach(
        function (key) {

            if (
                details[key] !== "" &&
                details[key] !== null &&
                details[key] !== undefined
            ) {

                detailsHtml += `
                    <p>
                        <strong>
                            ${formatDetailName(key)}:
                        </strong>
                        ${escapeHtml(details[key])}
                    </p>
                `;

            }

        }
    );


    summary.innerHTML = `

        <h3>
            بررسی نهایی درخواست
        </h3>

        <div class="summary-section">

            <h4>
                خدمت موردنظر
            </h4>

            <p>
                ${escapeHtml(
                    requestData.serviceName || "-"
                )}
            </p>

        </div>


        <div class="summary-section">

            <h4>
                محل انجام خدمات
            </h4>

            <p>
                <strong>منطقه:</strong>
                ${escapeHtml(
                    requestData.location.region || "-"
                )}
            </p>

            <p>
                <strong>آدرس:</strong>
                ${escapeHtml(
                    requestData.location.address || "-"
                )}
            </p>

        </div>


        <div class="summary-section">

            <h4>
                جزئیات خدمت
            </h4>

            ${detailsHtml || "<p>اطلاعاتی ثبت نشده است.</p>"}

        </div>


        <div class="summary-section">

            <h4>
                زمان انجام خدمات
            </h4>

            <p>
                <strong>تاریخ:</strong>
                ${escapeHtml(
                    requestData.schedule.date || "-"
                )}
            </p>

            <p>
                <strong>ساعت:</strong>
                ${escapeHtml(
                    requestData.schedule.time || "-"
                )}
            </p>

            ${
                requestData.schedule.description
                ? `
                    <p>
                        <strong>توضیحات:</strong>
                        ${escapeHtml(
                            requestData.schedule.description
                        )}
                    </p>
                `
                : ""
            }

        </div>

    `;

}


// =====================================================
// نام فارسی فیلدها
// =====================================================

function formatDetailName(key) {

    const names = {

        type: "نوع خدمت",

        status: "وضعیت منزل",

        floors: "تعداد طبقات",

        units: "تعداد واحدها",

        entrances: "تعداد ورودی",

        elevator: "آسانسور",

        ladder: "کار با نردبان",

        area: "متراژ",

        rooms: "تعداد اتاق",

        toilets: "تعداد سرویس",

        bathrooms: "تعداد حمام",

        pet: "حیوان خانگی",

        staff: "تعداد نیرو",

        guests: "تعداد مهمان",

        gender: "نوع نیروی موردنیاز",

        title: "عنوان خدمت",

        description: "توضیحات"

    };


    return names[key] || key;

}


// =====================================================
// دکمه برگشت مرحله ۵
// =====================================================

const backStep5 =
    document.getElementById(
        "back-step-5"
    );


if (backStep5) {

    backStep5.addEventListener(
        "click",
        function () {

            requestData.customer.name =
                getValue(
                    "customer-name"
                );


            requestData.customer.mobile =
                getValue(
                    "customer-mobile"
                );


            showStep(4);

        }
    );

}


// =====================================================
// دکمه ثبت نهایی
// =====================================================

const submitRequest =
    document.getElementById(
        "submit-request"
    );


if (submitRequest) {

    submitRequest.addEventListener(
        "click",
        async function () {

            const name =
                getValue(
                    "customer-name"
                );


            const mobile =
                getValue(
                    "customer-mobile"
                );


            if (!name) {

                alert(
                    "لطفاً نام و نام خانوادگی خود را وارد کنید."
                );

                return;

            }


            if (!mobile) {

                alert(
                    "لطفاً شماره موبایل خود را وارد کنید."
                );

                return;

            }


            if (
                !isValidMobile(
                    mobile
                )
            ) {

                alert(
                    "لطفاً یک شماره موبایل معتبر وارد کنید."
                );

                return;

            }


            requestData.customer.name =
                name;


            requestData.customer.mobile =
                mobile;


            // =========================================
            // ساخت شماره پیگیری
            // =========================================

            const trackingNumber =
                createTrackingNumber();


            requestData.trackingNumber =
                trackingNumber;


            // =========================================
            // ذخیره محلی
            // =========================================

            saveRequestLocally(
                requestData
            );


            // =========================================
            // ارسال به Google Apps Script
            // =========================================

            submitRequest.disabled =
                true;


            submitRequest.textContent =
                "در حال ثبت درخواست...";


            try {

                const response =
                    await fetch(
                        APPS_SCRIPT_URL,
                        {
                            method: "POST",

                            body:
                                JSON.stringify(
                                    requestData
                                )
                        }
                    );


                const result =
                    await response.json();


                if (
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "ثبت درخواست در سرور انجام نشد."
                    );

                }


                // نمایش موفقیت
                showSubmitSuccess(
                    trackingNumber
                );


            } catch (error) {

                console.error(
                    "خطا در ارسال درخواست:",
                    error
                );


                submitRequest.disabled =
                    false;


                submitRequest.textContent =
                    "ثبت نهایی درخواست";


                alert(
                    "در ارسال درخواست مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
                );

            }

        }
    );

}


// =====================================================
// ساخت شماره پیگیری
// =====================================================

function createTrackingNumber() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "NK-" +
        year +
        month +
        day +
        "-" +
        random
    );

}


// =====================================================
// ذخیره درخواست در مرورگر
// =====================================================

function saveRequestLocally(data) {

    const oldRequests =
        JSON.parse(
            localStorage.getItem(
                "entekhabNikRequests"
            ) || "[]"
        );


    oldRequests.push({

        trackingNumber:
            data.trackingNumber,

        createdAt:
            new Date().toISOString(),

        data:
            data

    });


    localStorage.setItem(
        "entekhabNikRequests",
        JSON.stringify(
            oldRequests
        )
    );

}


// =====================================================
// نمایش پیام موفقیت
// =====================================================

function showSubmitSuccess(
    trackingNumber
) {

    const message =
        document.getElementById(
            "submit-message"
        );


    if (!message) {
        return;
    }


    message.innerHTML = `

        <div class="success-box">

            <div class="success-icon">
                ✓
            </div>

            <h3>
                درخواست شما با موفقیت ثبت شد
            </h3>

            <p>
                شماره پیگیری شما:
            </p>

            <strong
                class="tracking-number"
                dir="ltr"
            >
                ${escapeHtml(
                    trackingNumber
                )}
            </strong>

            <p>
                درخواست شما برای بررسی و هماهنگی ارسال شد.
            </p>

            <p>
                لطفاً شماره پیگیری را نزد خود نگه دارید.
            </p>

        </div>

    `;


    submitRequest.disabled =
        true;


    submitRequest.textContent =
        "✓ درخواست ثبت شد";

}


// =====================================================
// جلوگیری از ورود HTML ناخواسته
// =====================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}