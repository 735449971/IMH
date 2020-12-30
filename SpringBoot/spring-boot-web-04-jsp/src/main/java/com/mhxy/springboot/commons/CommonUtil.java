package com.mhxy.springboot.commons;

import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.util.*;

/**
 * @author wxl
 * @date 2020/12/30 14:46
 */
public class CommonUtil {

    public CommonUtil() {
    }

    public static boolean isNullOrEmpty(Object obj) {
        return obj == null;
    }

    public static boolean isIntThanZero(int number) {
        return number > 0;
    }

    public static String getRandomString(int length) {
        String base = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();

        for(int i = 0; i < length; ++i) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }

        return sb.toString();
    }

    public static String dateType(Object o) {
        return o instanceof Date ? DateUtil.getDay((Date)o) : o.toString();
    }

    public static String getExceptionMsg(Exception e) {
        StringWriter sw = new StringWriter();

        try {
            e.printStackTrace(new PrintWriter(sw));
        } finally {
            try {
                sw.close();
            } catch (IOException var8) {
                var8.printStackTrace();
            }

        }

        return sw.getBuffer().toString().replaceAll("\\$", "T");
    }

    public static boolean equals(Object obj1, Object obj2) {
        return obj1 != null ? obj1.equals(obj2) : obj2 == null;
    }

    public static int length(Object obj) {
        if (obj == null) {
            return 0;
        } else if (obj instanceof CharSequence) {
            return ((CharSequence)obj).length();
        } else if (obj instanceof Collection) {
            return ((Collection)obj).size();
        } else if (obj instanceof Map) {
            return ((Map)obj).size();
        } else {
            int count;
            if (obj instanceof Iterator) {
                Iterator<?> iter = (Iterator)obj;
                count = 0;

                while(iter.hasNext()) {
                    ++count;
                    iter.next();
                }

                return count;
            } else if (!(obj instanceof Enumeration)) {
                return obj.getClass().isArray() ? Array.getLength(obj) : -1;
            } else {
                Enumeration<?> enumeration = (Enumeration)obj;
                count = 0;

                while(enumeration.hasMoreElements()) {
                    ++count;
                    enumeration.nextElement();
                }

                return count;
            }
        }
    }

    public static boolean contains(Object obj, Object element) {
        if (obj == null) {
            return false;
        } else if (obj instanceof String) {
            return element == null ? false : ((String)obj).contains(element.toString());
        } else if (obj instanceof Collection) {
            return ((Collection)obj).contains(element);
        } else if (obj instanceof Map) {
            return ((Map)obj).values().contains(element);
        } else {
            Object o;
            if (obj instanceof Iterator) {
                Iterator iter = (Iterator)obj;

                do {
                    if (!iter.hasNext()) {
                        return false;
                    }

                    o = iter.next();
                } while(!equals(o, element));

                return true;
            } else if (obj instanceof Enumeration) {
                Enumeration enumeration = (Enumeration)obj;

                do {
                    if (!enumeration.hasMoreElements()) {
                        return false;
                    }

                    o = enumeration.nextElement();
                } while(!equals(o, element));

                return true;
            } else {
                if (obj.getClass().isArray()) {
                    int len = Array.getLength(obj);

                    for(int i = 0; i < len; ++i) {
                        Object o1 = Array.get(obj, i);
                        if (equals(o1, element)) {
                            return true;
                        }
                    }
                }

                return false;
            }
        }
    }

    public static boolean isNotEmpty(Object o) {
        return !isEmpty(o);
    }

    public static boolean isEmpty(Object o) {
        if (o == null) {
            return true;
        } else {
            if (o instanceof String) {
                if (o.toString().trim().equals("")) {
                    return true;
                }
            } else if (o instanceof List) {
                if (((List)o).size() == 0) {
                    return true;
                }
            } else if (o instanceof Map) {
                if (((Map)o).size() == 0) {
                    return true;
                }
            } else if (o instanceof Set) {
                if (((Set)o).size() == 0) {
                    return true;
                }
            } else if (o instanceof Object[]) {
                if (((Object[])((Object[])o)).length == 0) {
                    return true;
                }
            } else if (o instanceof int[]) {
                if (((int[])((int[])o)).length == 0) {
                    return true;
                }
            } else if (o instanceof long[] && ((long[])((long[])o)).length == 0) {
                return true;
            }

            return false;
        }
    }

    public static boolean isOneEmpty(Object... os) {
        Object[] var1 = os;
        int var2 = os.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            Object o = var1[var3];
            if (isEmpty(o)) {
                return true;
            }
        }

        return false;
    }

    public static boolean isAllEmpty(Object... os) {
        Object[] var1 = os;
        int var2 = os.length;

        for(int var3 = 0; var3 < var2; ++var3) {
            Object o = var1[var3];
            if (!isEmpty(o)) {
                return false;
            }
        }

        return true;
    }

    public static boolean isNum(Object obj) {
        try {
            Integer.parseInt(obj.toString());
            return true;
        } catch (Exception var2) {
            return false;
        }
    }

    public static Object getValue(Object str, Object defaultValue) {
        return isEmpty(str) ? defaultValue : str;
    }

    public static String toStr(Object str) {
        return toStr(str, "");
    }

    public static String toStr(Object str, String defaultValue) {
        return null == str ? defaultValue : str.toString().trim();
    }

    public static Map<String, Object> caseInsensitiveMap(Map<String, Object> map) {
        Map<String, Object> tempMap = new HashMap();
        Iterator var2 = map.keySet().iterator();

        while(var2.hasNext()) {
            String key = (String)var2.next();
            tempMap.put(key.toLowerCase(), map.get(key));
        }

        return tempMap;
    }

    public static <K, V> V getFirstOrNull(Map<K, V> map) {
        V obj = null;
        Iterator var2 = map.entrySet().iterator();

        while(var2.hasNext()) {
            Map.Entry<K, V> entry = (Map.Entry)var2.next();
            obj = entry.getValue();
            if (obj != null) {
                break;
            }
        }

        return obj;
    }

    public static StringBuilder builder(String... strs) {
        StringBuilder sb = new StringBuilder();
        String[] var2 = strs;
        int var3 = strs.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            String str = var2[var4];
            sb.append(str);
        }

        return sb;
    }

    public static void builder(StringBuilder sb, String... strs) {
        String[] var2 = strs;
        int var3 = strs.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            String str = var2[var4];
            sb.append(str);
        }

    }

    public static String removeSuffix(String str, String suffix) {
        if (!isEmpty(str) && !isEmpty(suffix)) {
            return str.endsWith(suffix) ? str.substring(0, str.length() - suffix.length()) : str;
        } else {
            return str;
        }
    }

    public static String currentTime() {
        return DateUtil.getTime();
    }

    public static Boolean isWinOs() {
        String os = System.getProperty("os.name");
        return os.toLowerCase().startsWith("win") ? true : false;
    }

    public static String getTempPath() {
        return System.getProperty("java.io.tmpdir");
    }

    public static Integer toInt(Object val) {
        if (val instanceof Double) {
            BigDecimal bigDecimal = new BigDecimal((Double)val);
            return bigDecimal.intValue();
        } else {
            return Integer.valueOf(val.toString());
        }
    }

    public static String getWebRootPath(String filePath) {
        try {
            String path = CommonUtil.class.getClassLoader().getResource("").toURI().getPath();
            path = path.replace("/WEB-INF/classes/", "");
            path = path.replace("/target/classes/", "");
            path = path.replace("file:/", "");
            return isEmpty(filePath) ? path : path + "/" + filePath;
        } catch (URISyntaxException var2) {
            throw new RuntimeException(var2);
        }
    }

    public static String fixSpecialForLike(String keyword) {
        if (!StringUtils.isNotBlank(keyword)) {
            return null;
        } else {
            char[] keys = keyword.toCharArray();
            StringBuilder sb = new StringBuilder();
            char[] var3 = keys;
            int var4 = keys.length;

            for(int var5 = 0; var5 < var4; ++var5) {
                char key = var3[var5];
                if (key == '%' || key == '_') {
                    sb.append('\\');
                }

                sb.append(key);
            }

            return sb.toString();
        }
    }

    public static Map<String, Object> fixSpecialForLike(Map<String, Object> params, String... keys) {
        if (keys.length == 0) {
            return params;
        } else {
            String[] var2 = keys;
            int var3 = keys.length;

            for(int var4 = 0; var4 < var3; ++var4) {
                String key = var2[var4];
                Object value = params.get(key);
                if (value != null) {
                    params.put(key, fixSpecialForLike(String.valueOf(value)));
                }
            }

            return params;
        }
    }
}
