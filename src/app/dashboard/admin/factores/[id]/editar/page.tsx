
'use client';
import EditarFactorForm from '@/src/components/admin/factores/EditarFactoresForm';
import { useParams } from 'next/navigation';

export default function EditarFactorPage() {
    const params = useParams();
    const id = params.id as string;
    return <EditarFactorForm id={id} />;
}