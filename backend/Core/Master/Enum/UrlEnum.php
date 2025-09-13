<?php

namespace Espo\Custom\Core\Master\Enum;

class UrlEnum
{
    private const GET_TICKET_BY_MASTER_TICKET_ID_CONNECTION = '/api/остальной/путь/%s';
    private const GET_TICKET_BY_MASTER_TICKET_ID_SERVICES= '/api/остальной/путь/%s';
    private const GET_FREE_SLOTS_BY_MASTER_TICKET_ID = '/api/остальной/путь/%s/метод';
    private const UPDATE_TICKET_STATUS = 'api/остальной/путь/%s/метод';
    private const SET_SCHEDULING_API = 'api/остальной/путь/%s/метод';
    private const SET_SCHEDULING_CLIENT = 'api/остальной/путь/%s/метод';
    private const IS_BRIGADE_ZONE = 'api/остальной/путь/%s/метод';

    public static function getTicketConnectionUrl(string $masterTicketId): string
    {
        return self::convertUrl(self::GET_TICKET_BY_MASTER_TICKET_ID_CONNECTION, [$masterTicketId]);
    }

    public static function getTicketServicesUrl(string $masterTicketId): string
    {
        return self::convertUrl(self::GET_TICKET_BY_MASTER_TICKET_ID_SERVICES, [$masterTicketId]);
    }

    public static function setSchedulingApi(string $masterTicketId): string
    {
        return self::convertUrl(self::SET_SCHEDULING_API, [$masterTicketId]);
    }

    public static function setV1ClientScheduling(string $masterTicketId): string
    {
        return self::convertUrl(self::SET_SCHEDULING_CLIENT, [$masterTicketId]);
    }

    public static function getFreeSlotsByMasterTicketId(string $masterTicketId): string
    {
        return self::convertUrl(self::GET_FREE_SLOTS_BY_MASTER_TICKET_ID, [$masterTicketId]);
    }

    public static function putUpdateTicketStatus(string $masterTicketId): string
    {
        return self::convertUrl(self::UPDATE_TICKET_STATUS, [$masterTicketId]);
    }

    public static function isBrigadeZone(string $houseUuid1c): string
    {
        return self::convertUrl(self::IS_BRIGADE_ZONE, [$houseUuid1c]);
    }

    private static function convertUrl(string $url, array $masterTicketId): string
    {
        return sprintf($url, ...$masterTicketId);
    }
}
