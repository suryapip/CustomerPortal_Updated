using System;
using System.Collections.Generic;
using System.Text;

namespace ScentAir.Payment
{
    public class ByteArrayEqualityComparer : EqualityComparer<byte[]>
    {
        private static readonly object locker = new object();
        private static ByteArrayEqualityComparer instance;

        public static new ByteArrayEqualityComparer Default
        {
            get
            {
                if (instance == null)
                    lock (locker)
                        if (instance == null)
                            instance = new ByteArrayEqualityComparer();

                return instance;
            }
        }

        public override bool Equals(byte[] x, byte[] y)
        {
            if (x == null && y == null)
                return true;
            if (x != null && y == null)
                return false;
            if (x == null && y != null)
                return false;
            if (x.Length != y.Length)
                return false;


            var i = 0;
            for (; i < x.Length; i++)
                if (x[i] != y[i])
                    break;

            return i == x.Length;
        }
        public override int GetHashCode(byte[] obj) => obj.GetHashCode();
    }
}
