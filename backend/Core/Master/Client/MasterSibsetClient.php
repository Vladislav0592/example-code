<?php

namespace Espo\Custom\Core\Master\Client;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Http\Message\ResponseInterface;


class MasterSibsetClient
{
    public function __construct(
        private ClientInterface $client
    ) {
    }

    /**
     * @throws GuzzleException
     */
    public function send(string $method, string $url, array $data = []): ResponseInterface
    {
        return $this->client->request(
            $method,
            $url,
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'X-API-Key' => $this->client->getConfig()['api_key']
                ],
                'body' => json_encode($data, JSON_UNESCAPED_UNICODE)
            ]
        );
    }
}
