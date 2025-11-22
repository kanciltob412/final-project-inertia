<?php

namespace App\Http\Controllers;

use App\Services\RajaOngkir;
use App\Services\RajaOngkirMock;
use Illuminate\Http\Request;

class RajaOngkirController extends Controller
{
    private RajaOngkir|RajaOngkirMock $rajaOngkir;

    public function __construct()
    {
        // Use mock service when API is not available
        try {
            $this->rajaOngkir = new RajaOngkir();
        } catch (\Exception $e) {
            // Fall back to mock service
            $this->rajaOngkir = new RajaOngkirMock();
        }
    }

    /**
     * Get all provinces
     */
    public function getProvinces()
    {
        try {
            $provinces = $this->rajaOngkir->getProvinces();

            return response()->json([
                'success' => true,
                'data' => $provinces,
            ]);
        } catch (\Exception $e) {
            // Fall back to mock service if main service fails
            try {
                $mock = new RajaOngkirMock();
                $provinces = $mock->getProvinces();
                return response()->json([
                    'success' => true,
                    'data' => $provinces,
                ]);
            } catch (\Exception $mockError) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        }
    }

    /**
     * Get cities by province
     */
    public function getCities(Request $request)
    {
        $request->validate([
            'province_id' => 'required|integer',
        ]);

        try {
            $cities = $this->rajaOngkir->getCities($request->province_id);

            return response()->json([
                'success' => true,
                'data' => $cities,
            ]);
        } catch (\Exception $e) {
            // Fall back to mock service if main service fails
            try {
                $mock = new RajaOngkirMock();
                $cities = $mock->getCities($request->province_id);
                return response()->json([
                    'success' => true,
                    'data' => $cities,
                ]);
            } catch (\Exception $mockError) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        }
    }

    /**
     * Calculate shipping cost
     */
    public function calculateShipping(Request $request)
    {
        $request->validate([
            'origin_city_id' => 'required|integer',
            'destination_city_id' => 'required|integer',
            'weight' => 'required|integer|min:1',
            'courier' => 'nullable|string|in:jne,tiki,pos',
        ]);

        try {
            $courier = $request->courier ?? 'jne';

            $shippingCost = $this->rajaOngkir->getShippingCost(
                $request->origin_city_id,
                $request->destination_city_id,
                $request->weight,
                $courier
            );

            return response()->json([
                'success' => true,
                'data' => $shippingCost,
            ]);
        } catch (\Exception $e) {
            // Fall back to mock service if main service fails
            try {
                $mock = new RajaOngkirMock();
                $courier = $request->courier ?? 'jne';
                $shippingCost = $mock->getShippingCost(
                    $request->origin_city_id,
                    $request->destination_city_id,
                    $request->weight,
                    $courier
                );
                return response()->json([
                    'success' => true,
                    'data' => $shippingCost,
                ]);
            } catch (\Exception $mockError) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        }
    }

    /**
     * Get shipping costs for multiple couriers
     */
    public function getMultipleShippingCosts(Request $request)
    {
        $request->validate([
            'origin_city_id' => 'required|integer',
            'destination_city_id' => 'required|integer',
            'weight' => 'required|integer|min:1',
            'couriers' => 'nullable|array',
            'couriers.*' => 'string|in:jne,tiki,pos',
        ]);

        try {
            $couriers = $request->couriers ?? ['jne', 'tiki', 'pos'];

            $shippingCosts = $this->rajaOngkir->getMultipleShippingCosts(
                $request->origin_city_id,
                $request->destination_city_id,
                $request->weight,
                $couriers
            );

            return response()->json([
                'success' => true,
                'data' => $shippingCosts,
            ]);
        } catch (\Exception $e) {
            // Fall back to mock service if main service fails
            try {
                $mock = new RajaOngkirMock();
                $couriers = $request->couriers ?? ['jne', 'tiki', 'pos'];
                $shippingCosts = $mock->getMultipleShippingCosts(
                    $request->origin_city_id,
                    $request->destination_city_id,
                    $request->weight,
                    $couriers
                );
                return response()->json([
                    'success' => true,
                    'data' => $shippingCosts,
                ]);
            } catch (\Exception $mockError) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        }
    }

    /**
     * Get available couriers
     */
    public function getAvailableCouriers()
    {
        try {
            $couriers = $this->rajaOngkir->getAvailableCouriers();

            return response()->json([
                'success' => true,
                'data' => $couriers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
