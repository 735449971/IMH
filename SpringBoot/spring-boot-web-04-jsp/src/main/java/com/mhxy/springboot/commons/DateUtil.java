package com.mhxy.springboot.commons;


import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.UUID;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.commons.lang3.time.DateUtils;
/**
 * @author wxl
 * @date 2020/12/30 14:46
 */
public class DateUtil {

    public static final String DateFormat1 = "yyyy-MM-dd HH:mm:ss";
    public static final String DateFormat2 = "yyyy-MM-dd";
    public static final String DateFormat3 = "yyyyMMdd";
    public static final String DateFormat4 = "yyyyMMdd HHmmss";
    public static final String DateFormat5 = "yyyy-MM-dd HH:mm";
    public static final String DateFormat6 = "yyyyMMdd HH:mm";
    public static final String DateFormat7 = "yyyy年MM月dd日";

    public DateUtil() {
    }

    public static String getYear() {
        return formatDate(new Date(), "yyyy");
    }

    public static String getYear(Date date) {
        return formatDate(date, "yyyy");
    }

    public static String getDay() {
        return formatDate(new Date(), "yyyy-MM-dd");
    }

    public static String getDay(Date date) {
        return formatDate(date, "yyyy-MM-dd");
    }

    public static String getDays() {
        return formatDate(new Date(), "yyyyMMdd");
    }

    public static String getDays(Date date) {
        return formatDate(date, "yyyyMMdd");
    }

    public static String getTime() {
        return formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
    }

    public static String getMsTime() {
        return formatDate(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    }

    public static String getAllTime() {
        return formatDate(new Date(), "yyyyMMddHHmmss");
    }

    public static String getTime(Date date) {
        return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    }

    public static String formatDate(Date date, String pattern) {
        String formatDate = null;
        if (StringUtils.isNotBlank(pattern)) {
            formatDate = DateFormatUtils.format(date, pattern);
        } else {
            formatDate = DateFormatUtils.format(date, "yyyy-MM-dd");
        }

        return formatDate;
    }

    public static boolean compareDate(String s, String e) {
        if (parseDate(s) != null && parseDate(e) != null) {
            return parseDate(s).getTime() >= parseDate(e).getTime();
        } else {
            return false;
        }
    }

    public static Date parseDate(String date) {
        return parse(date, "yyyy-MM-dd");
    }

    public static Date parseTime(String date) {
        return parse(date, "yyyy-MM-dd HH:mm:ss");
    }

    public static Date parse(String date, String pattern) {
        try {
            return DateUtils.parseDate(date, new String[]{pattern});
        } catch (ParseException var3) {
            var3.printStackTrace();
            return null;
        }
    }

    public static String format(Date date, String pattern) {
        return DateFormatUtils.format(date, pattern);
    }

    public static Timestamp format(Date date) {
        return new Timestamp(date.getTime());
    }

    public static boolean isValidDate(String s) {
        return parse(s, "yyyy-MM-dd HH:mm:ss") != null;
    }

    public static boolean isValidDate(String s, String pattern) {
        return parse(s, pattern) != null;
    }

    public static int getDiffYear(String startTime, String endTime) {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");

        try {
            int years = (int)((fmt.parse(endTime).getTime() - fmt.parse(startTime).getTime()) / 86400000L / 365L);
            return years;
        } catch (Exception var4) {
            return 0;
        }
    }

    public static long getDaySub(String beginDateStr, String endDateStr) {
        long day = 0L;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date beginDate = null;
        Date endDate = null;

        try {
            beginDate = format.parse(beginDateStr);
            endDate = format.parse(endDateStr);
        } catch (ParseException var8) {
            var8.printStackTrace();
        }

        day = (endDate.getTime() - beginDate.getTime()) / 86400000L;
        return day;
    }

    public static String getAfterDayDate(String days) {
        int daysInt = Integer.parseInt(days);
        Calendar canlendar = Calendar.getInstance();
        canlendar.add(5, daysInt);
        Date date = canlendar.getTime();
        SimpleDateFormat sdfd = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String dateStr = sdfd.format(date);
        return dateStr;
    }

    public static String getAfterDayWeek(String days) {
        int daysInt = Integer.parseInt(days);
        Calendar canlendar = Calendar.getInstance();
        canlendar.add(5, daysInt);
        Date date = canlendar.getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("E");
        String dateStr = sdf.format(date);
        return dateStr;
    }

    public static String getNowDate() {
        return (new SimpleDateFormat("yyyy-MM-dd")).format(new Date());
    }

    public static Date getDateByString(String dateStr) {
        Date date = null;

        try {
            date = (new SimpleDateFormat("yyyy-MM-dd hh:mm:ss")).parse(dateStr);
        } catch (ParseException var3) {
            var3.printStackTrace();
        }

        return date;
    }

    public static Date createDate() {
        String nowDate = (new SimpleDateFormat("yyyy-MM-dd")).format(new Date());
        Date date = null;

        try {
            date = (new SimpleDateFormat("yyyy-MM-dd")).parse(nowDate);
        } catch (ParseException var3) {
            var3.printStackTrace();
        }

        return date;
    }

    public static String getNowDateStr() {
        return (new SimpleDateFormat("yyyyMMddHHmmss")).format(new Date());
    }

    public static String getNowDateStr2() {
        return (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());
    }

    public static String getStrUUID() {
        Random random = new Random();
        int end = random.nextInt(999);
        String endStr = String.format("%03d", end);
        return UUID.randomUUID().toString().replace("-", "") + endStr;
    }

    public static int getDayCount(Date beginDate, Date endDate) {
        int count = 0;
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(beginDate);

        while(calendar.getTime().before(endDate)) {
            ++count;
            calendar.add(6, 1);
        }

        return count;
    }

    public static String getLastMonth(Date data) {
        Calendar calendar = Calendar.getInstance();
        Date date = new Date(System.currentTimeMillis());
        calendar.setTime(date);
        calendar.add(2, -1);
        date = calendar.getTime();
        return getStringDate(date, "yyyy-MM-dd");
    }

    public static String getNextMonth(Date data) {
        Calendar calendar = Calendar.getInstance();
        Date date = new Date(System.currentTimeMillis());
        calendar.setTime(date);
        calendar.add(2, 1);
        date = calendar.getTime();
        return getStringDate(date, "yyyy-MM-dd");
    }

    public static String LongToString(long diff) {
        String showtime = "";
        long oneSecond = 1000L;
        long oneMinute = oneSecond * 60L;
        long oneHour = oneMinute * 60L;
        long oneDay = oneHour * 24L;
        long days = diff / oneDay;
        diff -= days * oneDay;
        long hours = diff / oneHour;
        diff -= hours * oneHour;
        long minutes = diff / oneMinute;
        diff -= minutes * oneMinute;
        long seconds = diff / oneSecond;
        if (days > 0L) {
            showtime = showtime + days + "天";
        }

        if (hours > 0L) {
            showtime = showtime + hours + "小时";
        }

        if (minutes > 0L) {
            showtime = showtime + minutes + "分";
        }

        if (seconds > 0L) {
            showtime = showtime + seconds + "秒";
        }

        return showtime;
    }

    public static String getStringDate(Date date, String method) {
        SimpleDateFormat sdf = new SimpleDateFormat(method);
        String ret = null;

        try {
            ret = sdf.format(date);
        } catch (Exception var5) {
        }

        return ret;
    }

    public static String getCurrentDate() {
        return formatDate(new Date());
    }

    public static String getCurrentDate(String formate) {
        return formatDate(new Date(), formate);
    }

    public static String getCurrentYear() {
        return formatDate(new Date(), "yyyy");
    }

    public static String getCurrentMonth() {
        return formatDate(new Date(), "MM");
    }

    public static String getCurrentDay() {
        return formatDate(new Date(), "dd");
    }

    public static String getCurrentWeek() {
        return formatDate(new Date(), "E");
    }

    public static String formatDate(Date date) {
        return formatDate(date, "yyyy-MM-dd HH:mm:ss");
    }

    public static Date parseDate(String date, String formate) {
        SimpleDateFormat sdf = new SimpleDateFormat(formate);

        try {
            return sdf.parse(date);
        } catch (ParseException var4) {
            var4.printStackTrace();
            return null;
        }
    }

    public static int compareToDate(String first, String second, String pattern) {
        DateFormat df = new SimpleDateFormat(pattern);
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();

        try {
            cal1.setTime(df.parse(first));
            cal2.setTime(df.parse(second));
        } catch (ParseException var7) {
            var7.printStackTrace();
            System.out.println("比较时间错误");
        }

        int result = cal1.compareTo(cal2);
        if (result < 0) {
            return -1;
        } else {
            return result > 0 ? 1 : 0;
        }
    }

    public static int compareToDate(Date first, Date second) {
        int result = first.compareTo(second);
        if (result < 0) {
            return -1;
        } else {
            return result > 0 ? 1 : 0;
        }
    }

    public static Date getAppointDate(Date date, int day) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(6, day);
        return calendar.getTime();
    }

    public static double getDistanceOfTwoDate(Date before, Date after) {
        long beforeTime = before.getTime();
        long afterTime = after.getTime();
        return (double)((afterTime - beforeTime) / 86400000L);
    }

    public static long pastDays(Date date) {
        long t = System.currentTimeMillis() - date.getTime();
        return t / 86400000L;
    }

    public static long pastHour(Date date) {
        long t = System.currentTimeMillis() - date.getTime();
        return t / 3600000L;
    }

    public static long pastMinutes(Date date) {
        long t = System.currentTimeMillis() - date.getTime();
        return t / 60000L;
    }

    public static Date getFirstDayOfWeek() {
        Calendar cal = Calendar.getInstance();
        cal.set(7, 2);
        return cal.getTime();
    }

    public static Date getFirstDayOfMonth() {
        Calendar cal = Calendar.getInstance();
        int firstDay = cal.getMinimum(5);
        cal.set(5, firstDay);
        return cal.getTime();
    }

    public static Date getFirstDayOfNextMonth() {
        Calendar cal = Calendar.getInstance();
        cal.add(2, 1);
        int firstDay = cal.getMinimum(5);
        cal.set(5, firstDay);
        return cal.getTime();
    }

    public static int getAgeByBirthDate(Date birtnDay) {
        Calendar cal = Calendar.getInstance();
        if (cal.before(birtnDay)) {
            return 0;
        } else {
            int yearNow = cal.get(1);
            int monthNow = cal.get(2);
            int dayOfMonthNow = cal.get(5);
            cal.setTime(birtnDay);
            int yearBirth = cal.get(1);
            int monthBirth = cal.get(2);
            int dayOfMonthBirth = cal.get(5);
            int age = yearNow - yearBirth;
            if (monthNow <= monthBirth) {
                if (monthNow == monthBirth) {
                    if (dayOfMonthNow < dayOfMonthBirth) {
                        --age;
                    }
                } else {
                    --age;
                }
            }

            return age;
        }
    }

    public static String dateType(Object o) {
        return o instanceof Date ? getDay((Date)o) : o.toString();
    }

    public static String getWeek(Date date) {
        String[] weeks = new String[]{"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int week_index = cal.get(7) - 1;
        if (week_index < 0) {
            week_index = 0;
        }

        return weeks[week_index];
    }

    public static int getWeekOfYear(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int week_of_year = cal.get(3);
        return week_of_year;
    }

    public static int getDaysOfMonth(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(1, year);
        cal.set(2, month - 1);
        int days_of_month = cal.getActualMaximum(5);
        return days_of_month;
    }

    public static String getWeekByDate(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("EEEE");
        String week = sdf.format(date);
        return week;
    }
}
