<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class RajaOngkir
{
    private string $apiKey;
    private string $baseUrl = 'https://api.rajaongkir.com/starter';

    public function __construct()
    {
        $this->apiKey = env('RAJAONGKIR_API_KEY');

        if (!$this->apiKey) {
            throw new Exception('RajaOngkir API Key not configured');
        }

        // Force exception to use mock service
        throw new Exception('RajaOngkir API is currently unavailable. Using mock data.');
    }

    /**
     * Get list of provinces
     */
    public function getProvinces()
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->get("{$this->baseUrl}province");

            if ($response->failed()) {
                throw new Exception('Failed to fetch provinces: ' . $response->status());
            }

            $data = $response->json();
            return $data['rajaongkir']['results'] ?? $data['results'] ?? [];
        } catch (Exception $e) {
            throw new Exception('RajaOngkir Error: ' . $e->getMessage());
        }
    }

    /**
     * Get cities in a province
     */
    public function getCities($provinceId)
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->get("{$this->baseUrl}city", [
                'province' => $provinceId,
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch cities: ' . $response->status());
            }

            $data = $response->json();
            return $data['rajaongkir']['results'] ?? $data['results'] ?? [];
        } catch (Exception $e) {
            throw new Exception('RajaOngkir Error: ' . $e->getMessage());
        }
    }

    /**
     * Get shipping cost
     */
    public function getShippingCost($originCityId, $destinationCityId, $weight, $courier = 'jne')
    {
        try {
            $response = Http::asForm()->withHeaders([
                'key' => $this->apiKey,
            ])->post("{$this->baseUrl}/cost", [
                'origin' => $originCityId,
                'destination' => $destinationCityId,
                'weight' => $weight,
                'courier' => $courier,
            ]);

            if ($response->failed()) {
                throw new Exception('Failed to fetch shipping cost: ' . $response->body());
            }

            $data = $response->json()['rajaongkir'];

            if (isset($data['status']['code']) && $data['status']['code'] !== 200) {
                throw new Exception($data['status']['description'] ?? 'Unknown error');
            }

            return [
                'origin' => $data['origin_details'] ?? [],
                'destination' => $data['destination_details'] ?? [],
                'results' => $data['results'] ?? [],
            ];
        } catch (Exception $e) {
            throw new Exception('RajaOngkir Error: ' . $e->getMessage());
        }
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
            } catch (Exception $e) {
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
