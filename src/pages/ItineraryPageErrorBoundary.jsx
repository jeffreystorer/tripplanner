import { useEffect } from 'react';
import { redirect, redirectDocument, useNavigate} from 'react-router-dom';
import { TripPage } from '@/pages';

export default function ItineraryPageErrorBoundary(){
    const navigate = useNavigate();
    navigate('/pages/trip')
    redirect('/pages/trip');
    redirectDocument('/pages/trip')


    useEffect(() => {
        navigate('/pages/trip')
        redirect('/pages/trip');
        redirectDocument('/pages/trip')
    },[])
    
    return <TripPage />;
}