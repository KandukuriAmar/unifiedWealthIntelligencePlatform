import React from 'react';
import { redirect } from 'next/navigation';

export default function SuperAdminSettings() {
  redirect('/superadmin/dashboard');
}
