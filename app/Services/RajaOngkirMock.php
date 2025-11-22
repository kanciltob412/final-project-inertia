<?php

namespace App\Services;

/**
 * Mock RajaOngkir Service for demonstration when API is not available
 * Remove this when you have an active RajaOngkir API account
 */
class RajaOngkirMock
{
    /**
     * Get list of provinces (Mock data)
     */
    public function getProvinces()
    {
        return [
            ['province_id' => '1', 'province' => 'Bali'],
            ['province_id' => '2', 'province' => 'Bangka Belitung'],
            ['province_id' => '3', 'province' => 'Banten'],
            ['province_id' => '4', 'province' => 'Bengkulu'],
            ['province_id' => '5', 'province' => 'DI Yogyakarta'],
            ['province_id' => '6', 'province' => 'DKI Jakarta'],
            ['province_id' => '7', 'province' => 'Gorontalo'],
            ['province_id' => '8', 'province' => 'Jambi'],
            ['province_id' => '9', 'province' => 'Jawa Barat'],
            ['province_id' => '10', 'province' => 'Jawa Tengah'],
            ['province_id' => '11', 'province' => 'Jawa Timur'],
            ['province_id' => '12', 'province' => 'Kalimantan Barat'],
            ['province_id' => '13', 'province' => 'Kalimantan Selatan'],
            ['province_id' => '14', 'province' => 'Kalimantan Tengah'],
            ['province_id' => '15', 'province' => 'Kalimantan Timur'],
            ['province_id' => '16', 'province' => 'Kepulauan Riau'],
            ['province_id' => '17', 'province' => 'Lampung'],
            ['province_id' => '18', 'province' => 'Maluku'],
            ['province_id' => '19', 'province' => 'Maluku Utara'],
            ['province_id' => '20', 'province' => 'Nusa Tenggara Barat'],
            ['province_id' => '21', 'province' => 'Nusa Tenggara Timur'],
            ['province_id' => '22', 'province' => 'Papua'],
            ['province_id' => '23', 'province' => 'Papua Barat'],
            ['province_id' => '24', 'province' => 'Riau'],
            ['province_id' => '25', 'province' => 'Sulawesi Barat'],
            ['province_id' => '26', 'province' => 'Sulawesi Selatan'],
            ['province_id' => '27', 'province' => 'Sulawesi Tengah'],
            ['province_id' => '28', 'province' => 'Sulawesi Tenggara'],
            ['province_id' => '29', 'province' => 'Sulawesi Utara'],
            ['province_id' => '30', 'province' => 'Sumatera Barat'],
            ['province_id' => '31', 'province' => 'Sumatera Selatan'],
            ['province_id' => '32', 'province' => 'Sumatera Utara'],
        ];
    }

    /**
     * Get cities in a province (Mock data)
     */
    public function getCities($provinceId)
    {
        $cities = [
            '1' => [
                ['city_id' => '1', 'city_name' => 'Denpasar', 'type' => 'Kota', 'postal_code' => '80000'],
                ['city_id' => '2', 'city_name' => 'Badung', 'type' => 'Kabupaten', 'postal_code' => '80200'],
            ],
            '6' => [
                ['city_id' => '154', 'city_name' => 'Jakarta Selatan', 'type' => 'Kota', 'postal_code' => '12000'],
                ['city_id' => '155', 'city_name' => 'Jakarta Pusat', 'type' => 'Kota', 'postal_code' => '10000'],
            ],
            '9' => [
                ['city_id' => '62', 'city_name' => 'Bandung', 'type' => 'Kota', 'postal_code' => '40000'],
                ['city_id' => '63', 'city_name' => 'Bogor', 'type' => 'Kota', 'postal_code' => '16100'],
            ],
        ];

        return $cities[$provinceId] ?? [];
    }

    /**
     * Get shipping cost (Mock data)
     */
    public function getShippingCost($originCityId, $destinationCityId, $weight, $courier = 'jne')
    {
        // Mock pricing based on courier and weight
        $basePrices = [
            'jne' => 10000,
            'tiki' => 9000,
            'pos' => 8000,
        ];

        $basePrice = $basePrices[$courier] ?? 10000;
        $weightCharge = ceil($weight / 1000) * 1500; // Rp 1500 per kg
        $cost = $basePrice + $weightCharge;

        return [
            'origin' => [
                'city_id' => $originCityId,
                'city_name' => 'Bandung',
                'province' => 'Jawa Barat',
            ],
            'destination' => [
                'city_id' => $destinationCityId,
                'city_name' => 'Jakarta',
                'province' => 'DKI Jakarta',
            ],
            'results' => [
                [
                    'costs' => [
                        [
                            'service' => strtoupper($courier) . ' Regular',
                            'description' => 'Layanan ' . strtoupper($courier),
                            'cost' => [
                                [
                                    'value' => $cost,
                                    'etd' => '2-3 hari kerja',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];
    }

    /**
     * Get multiple shipping costs for different couriers
     */
    public function getMultipleShippingCosts($originCityId, $destinationCityId, $weight, $couriers = ['jne', 'tiki', 'pos'])
    {
        $costs = [];

        foreach ($couriers as $courier) {
            try {
                $costs[$courier] = $this->getShippingCost($originCityId, $destinationCityId, $weight, $courier);
            } catch (\Exception $e) {
                $costs[$courier] = [
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $costs;
    }

    /**
     * Get available couriers
     */
    public function getAvailableCouriers()
    {
        return [
            'jne' => 'JNE',
            'tiki' => 'TIKI',
            'pos' => 'POS Indonesia',
        ];
    }
}
