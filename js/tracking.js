"use strict";

/* =====================================================
   Entekhab Nik
   پیگیری درخواست
   اتصال مستقیم به Google Apps Script
===================================================== */


/* =====================================================
   آدرس Google Apps Script
===================================================== */

const TRACKING_API_URL =
    "https://script.google.com/macros/s/AKfycbwSw_827fYRoVidZR8nm11zka1c7IA83BR6g-R4dLBWi21hV2-RnwhmnsJKEJyc3Q/exec";


/* =====================================================
   انتخاب عناصر صفحه
===================================================== */

const trackingInput =
    document.getElementById(
        "tracking-number"
    );


const trackingButton =
    document.getElementById(
        "tracking-search"
    );


const trackingResult =
    document.getElementById(
        "tracking-result"
    );


/* =====================================================
   فرار دادن HTML
===================================================== */

function escapeTracking(value) {

    return String(value ?? "")

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


/* =====================================================
   نمایش پیام
===================================================== */

function showTrackingMessage(
    message
) {

    if (!trackingResult) {
        return;
    }


    trackingResult.innerHTML = `
        <p>
            ${escapeTracking(message)}
        </p>
    `;


    trackingResult.classList.add(
        "show"
    );

}


/* =====================================================
   نمایش درخواست پیدا شده
===================================================== */

function showTrackingResult(
    data
) {

    if (!trackingResult) {
        return;
    }


    if (
        !data ||
        !data.success ||
        !data.found
    ) {

        trackingResult.innerHTML = `

            <p>
                ❌ درخواستی با این شماره پیگیری یافت نشد.
            </p>

            <p>
                لطفاً شماره پیگیری را بررسی کرده و دوباره تلاش کنید.
            </p>

        `;


        trackingResult.classList.add(
            "show"
        );


        return;

    }


    const trackingNumber =
        data.trackingNumber || "-";


    const serviceName =
        data.serviceName || "ثبت نشده";


    const customerName =
        data.customerName || "ثبت نشده";


    const region =
        data.region || "ثبت نشده";


    const address =
        data.address || "ثبت نشده";


    const serviceDate =
        data.serviceDate || "ثبت نشده";


    const serviceTime =
        data.serviceTime || "ثبت نشده";


    const status =
        data.status || "در انتظار بررسی";


    let createdAt =
        "ثبت نشده";


    if (data.createdAt) {

        const date =
            new Date(
                data.createdAt
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            createdAt =
                date.toLocaleString(
                    "fa-IR"
                );

        }

    }


    trackingResult.innerHTML = `

        <h3>
            درخواست شما پیدا شد
        </h3>


        <p>
            <strong>
                شماره پیگیری:
            </strong>

            <span dir="ltr">
                ${escapeTracking(
                    trackingNumber
                )}
            </span>
        </p>


        <p>
            <strong>
                نوع خدمت:
            </strong>

            ${escapeTracking(
                serviceName
            )}
        </p>


        <p>
            <strong>
                تاریخ ثبت درخواست:
            </strong>

            ${escapeTracking(
                createdAt
            )}
        </p>


        <p>
            <strong>
                وضعیت درخواست:
            </strong>

            ${escapeTracking(
                status
            )}
        </p>


        <p>
            <strong>
                نام مشتری:
            </strong>

            ${escapeTracking(
                customerName
            )}
        </p>


        <p>
            <strong>
                منطقه:
            </strong>

            ${escapeTracking(
                region
            )}
        </p>


        <p>
            <strong>
                آدرس:
            </strong>

            ${escapeTracking(
                address
            )}
        </p>


        <p>
            <strong>
                تاریخ انجام خدمات:
            </strong>

            ${escapeTracking(
                serviceDate
            )}
        </p>


        <p>
            <strong>
                ساعت:
            </strong>

            ${escapeTracking(
                serviceTime
            )}
        </p>

    `;


    trackingResult.classList.add(
        "show"
    );

}


/* =====================================================
   جستجوی درخواست در Google Sheet
===================================================== */

async function findRequest(
    trackingNumber
) {

    const url =
        TRACKING_API_URL +
        "?trackingNumber=" +
        encodeURIComponent(
            trackingNumber
        );


    const response =
        await fetch(
            url,
            {
                method: "GET",
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "خطا در ارتباط با سامانه."
        );

    }


    const data =
        await response.json();


    return data;

}


/* =====================================================
   دکمه پیگیری
===================================================== */

if (trackingButton) {

    trackingButton.addEventListener(
        "click",
        async function () {

            const trackingNumber =
                trackingInput
                    ? trackingInput.value
                        .trim()
                        .toUpperCase()
                    : "";


            /* -----------------------------------------
               بررسی خالی بودن شماره
            ----------------------------------------- */

            if (!trackingNumber) {

                showTrackingMessage(
                    "لطفاً شماره پیگیری را وارد کنید."
                );


                if (trackingInput) {

                    trackingInput.focus();

                }


                return;

            }


            /* -----------------------------------------
               نمایش وضعیت جستجو
            ----------------------------------------- */

            if (trackingResult) {

                trackingResult.innerHTML = `

                    <p>
                        در حال بررسی شماره پیگیری...
                    </p>

                `;


                trackingResult.classList.add(
                    "show"
                );

            }


            trackingButton.disabled =
                true;


            try {

                /* -------------------------------------
                   دریافت اطلاعات از Google Sheet
                ------------------------------------- */

                const data =
                    await findRequest(
                        trackingNumber
                    );


                /* -------------------------------------
                   نمایش نتیجه
                ------------------------------------- */

                showTrackingResult(
                    data
                );

            }


            catch (error) {

                console.error(
                    "Tracking error:",
                    error
                );


                showTrackingMessage(
                    "ارتباط با سامانه پیگیری برقرار نشد. لطفاً چند لحظه بعد دوباره تلاش کنید."
                );

            }


            finally {

                trackingButton.disabled =
                    false;

            }

        }
    );

}


/* =====================================================
   پیگیری با کلید Enter
===================================================== */

if (trackingInput) {

    trackingInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();


                if (trackingButton) {

                    trackingButton.click();

                }

            }

        }
    );

}