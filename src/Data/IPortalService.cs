using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.Text;

namespace ScentAir.Payment
{
    [ServiceContract]
    public interface IPortalService
    {
        [OperationContract(IsOneWay = true)]
        void EnableAutoPay(string accountNumber);
        [OperationContract(IsOneWay = true)]
        void DisableAutoPay(string accountNumber);
        [OperationContract(IsOneWay = true)]
        void Refresh(string accountNumber);
    }
}
