import { format, formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

export { };

export const monthYearFormat = (date: Date) => format(date, 'LLLL yyyy')
export const dateFormat = (date: Date) => format(date, 'dd.MM.yyyy')
export const dateFormatWithShortTime = (date: Date) => format(date, 'dd.MM.yyyy HH:mm')
export const dateFormatWithTime = (date: Date) => format(date, 'dd.MM.yyyy HH:mm:ss')
export const shortDateFormat = (date: Date) => format(date, 'dd MMMM', { locale: ru })
export const shortTimeFormat = (date: Date) => format(date, 'HH:mm')
export const timeFormat = (date: Date) => format(date, 'HH:mm:ss')
export const hoursToday = (date: Date) => formatDistance(date, new Date(), { includeSeconds: false, addSuffix: true, locale: ru })

export const getUtcAsLocal = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}

export const getLocalAsUtc = (date: Date) => {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
}

Date.prototype.toJSON = function () {
    //считаю кусок в конце 
    //в исо меняю Z на то, что посчиталось (+03:00 или -07:00 и т.д)
    const timeZone = getOffsetString(this)

    const dateResult = getUtcAsLocal(this).toISOString().replace("Z", timeZone);

    return dateResult;
}

function getOffsetString(date: Date) {
    const offset = date.getTimezoneOffset();
    const positiveOffset = Math.abs(offset);

    const sign = offset < 0 ? '+' : '-';
    const hh = Math.floor(positiveOffset / 60).toString().padStart(2, '0');
    const mm = (positiveOffset % 60).toString().padStart(2, '0');

    return `${sign}${hh}:${mm}`;
}