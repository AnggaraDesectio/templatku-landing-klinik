<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-klinik".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-klinik'),

    'flavors' => array (
  'landing-klinik' => 
  array (
    'label' => 'KLINIK SEHAT BERSAMA — Klinik',
    'brand_name' => 'KLINIK SEHAT BERSAMA',
    'brand_tagline' => 'Sehat itu dekat, melayani dengan hati',
    'brand_initials' => 'KSB',
    'accent' => '#047857',
    'category' => 'kesehatan',
    'home' => 'landings.klinik',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/klinik',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
