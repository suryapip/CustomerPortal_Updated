using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ScentAir.Payment
{
    internal static class Hash
    {
        public static string ToBase64String(this byte[] data, int maxLength = 0)
        {
            maxLength = maxLength < 5 ? 5 : maxLength;

            var result = new byte[maxLength - 4];

            var j = 0;
            for (var i = 0; i < data.Length; i++)
            {
                result[j] = (byte)(result[j] ^ 11 & data[i] ^ 13);

                if (++j == result.Length)
                    j = 0;
            }
            

            return Convert.ToBase64String(result);
        }

        public static byte[] ToBytes(this string source, Encoding encoding = null)
        {
            encoding = encoding ?? Encoding.UTF8;

            return encoding.GetBytes(source);

        }
    }
}
