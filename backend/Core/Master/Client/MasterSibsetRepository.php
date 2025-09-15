<?php

namespace Espo\Custom\Core\Master\Client;

use Espo\Custom\Core\Master\Enum\UrlEnum;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\HttpFoundation\Request;
use Throwable;
use RuntimeException;

class MasterSibsetRepository
{
    public function __construct(
        private MasterSibsetClient $masterClient
    ) {
    }

    /**
     * @return array{
     *     isOur: boolean,
     *     partners: array{id: string, name: string}[]
     * }|array
     * @throws GuzzleException
     */
    public function getTicketByMasterTicketIdConnection(string $masterTicketId): array
    {
        try {
            $response = $this->masterClient->send(Request::METHOD_GET, UrlEnum::getTicketConnectionUrl($masterTicketId));

            return json_decode($response->getBody()->getContents(), true);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    public function getTicketByMasterTicketIdServices(string $masterTicketId): array
    {
        try {
            $response = $this->masterClient->send(Request::METHOD_GET, UrlEnum::getTicketServicesUrl($masterTicketId));
            return json_decode($response->getBody()->getContents(), true);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    /**
     * @return array<array{id: string, name: string}>|array
     * @throws GuzzleException
     */
    public function getFreeSlotsByMasterTicketId(string $masterTicketId): array
    {
        try {
            $response = $this->masterClient->send(Request::METHOD_GET, UrlEnum::getFreeSlotsByMasterTicketId($masterTicketId));

            return json_decode($response->getBody()->getContents(), true);
        } catch (GuzzleException $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    public function patchTicketStatusInMaster(string $masterTicketId, string $resolutionId, string $stageAlias): void
    {
        try {
            $data = [
                'status' => $stageAlias,
                'resolution_id' => $resolutionId,
            ];

            $this->masterClient->send(Request::METHOD_PATCH, UrlEnum::putUpdateTicketStatus($masterTicketId), $data);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    public function putApiV1SchedulingInMaster(string $masterTicketId, ?string $timeFrameId, string $intervalStart): void
    {
        try {
            $data = [
                'timeframe_id' => $timeFrameId,
                'interval_start' => $intervalStart,
            ];

            $this->masterClient->send(Request::METHOD_PUT, UrlEnum::setSchedulingApi($masterTicketId), $data);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    public function putV1ClientSchedulingInMaster(string $masterTicketId, ?string $timeFrameId, string $intervalStart): void
    {
        $data = [
            'timeframe_id' => $timeFrameId,
            'interval_start' => $intervalStart,
        ];

        try {
            $this->masterClient->send(Request::METHOD_PUT, UrlEnum::setV1ClientScheduling($masterTicketId), $data);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }

    public function isBrigadeZone(string $houseUuid1c): array
    {
        try {
            $response = $this->masterClient->send(Request::METHOD_GET, UrlEnum::isBrigadeZone($houseUuid1c));

            return json_decode($response->getBody()->getContents(), true);
        } catch (Throwable $e) {
            $response = $e->getResponse();
            $errorBody = json_decode($response->getBody()->getContents(), true);

            $errorMessage = $errorBody['error']['message'] ?? 'Unknown error';
            throw new RuntimeException("API Error: {$errorMessage}", $response->getStatusCode());
        }
    }
}
