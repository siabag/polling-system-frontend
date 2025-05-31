
'use client';
import EditarFincaForm from '@/src/components/admin/fincas/editarFincaForm';
import { useParams } from 'next/navigation';

export default function EditarFincaPage() {
    const params = useParams();
    const id = params.id as string;
    return <EditarFincaForm id={id} />;
}