import { useContext, useEffect, useState } from 'react'
import { address } from '../../../Router/address'
import getAuthUser from '../../getAuthUser';
import axios from 'axios';
import shiftDatabase from '../../Sql/shiftManagement/shiftDatabase';
import { InternetStatusContext } from '../../../App';

function shiftController() {
    const isOnline = useContext(InternetStatusContext);

    const { retrieveAuthUser } = getAuthUser()
    const {storeShiftData,getShiftData } = shiftDatabase()
    const [shiftData, setShiftData] = useState()
    const fetchShift = async () => {
        const token = await retrieveAuthUser();
        await axios.get(address.shiftList, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            const data = response.data.data
            setShiftData(data)
            storeShiftData(data)
          
        }).catch(error => {
            console.error(error.message)
        })
    }

    useEffect(() => {
        if(isOnline){
           // getShiftData((res)=>setShiftData(res)).catch(err=>console.error(err))
            fetchShift()
        }
        if (!isOnline) {
            //getShiftData((res)=>setShiftData(res)).catch(err=>console.error(err))
            getShiftData()
                .then((res) => {
                    // Assuming res is the result you want to set to the state
                    setShiftData(res);
                })
                .catch((err) => {
                    console.error('Error fetching shift data:', err);
                });
        }
    }, [])

    return {shiftData}
}

export default shiftController
