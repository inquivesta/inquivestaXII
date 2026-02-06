'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MerchPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/merch/exclusives');
    }, [router]);

    return null;
}