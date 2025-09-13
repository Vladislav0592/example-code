<?php

use Fig\Http\Message\StatusCodeInterface;
use Symfony\Component\HttpFoundation\Response as EspoResponse;
use Espo\Custom\Core\HttpResponse\ErrorMessageResponse;
use stdClass;
use Throwable;

class Opportunity extends BaseController
{
    public function postActionCreateTicketInMaster(Request $request, Response $response): HttpResponseInterface
    {
        try {
            /** @var OpportunityService  $service */
            $this->getRecordService()->createTicketInMaster($request->getRouteParam('id'));
        } catch (Throwable $e) {
            return new ErrorMessageResponse($e->getCode(), $e->getMessage());
        }

        return new SuccessResponse();
    }

    public function getActionFreePlacesInMaster(Request $request, Response $response): HttpResponseInterface
    {
        try {
            $masterTicketId = $request->getQueryParam('masterTicketId');
            $stageId = $request->getQueryParam('stageIdOrStatusId');

            /** @var OpportunityService  $service */
            $service = $this->getRecordService();

            return new SuccessResponse([
               'result' => $service->getStatusInMaster($masterTicketId, $stageId)
            ]);
        } catch (Throwable $e) {
            return new ErrorResponse($e->getCode(), $e->getMessage());
        }
    }

    public function postActionSchedulingInMaster(Request $request, Response $response): void
    {
        try {
            $data = $request->getParsedBody();
            $masterTicketId = $data->masterTicketId;
            $timeFrameId = $data->timeFrameId ?: null;
            $intervalStart = $data->intervalStart;
            $nameButton = $data->nameButton ?: null;

            /** @var OpportunityService  $service */
            $service = $this->getRecordService();

            $service->setSchedulingInMaster($masterTicketId, $timeFrameId, $intervalStart, $nameButton);
            $response->setStatus(EspoResponse::HTTP_NO_CONTENT);
        } catch (Throwable $e) {
            $response->setStatus(StatusCodeInterface::STATUS_INTERNAL_SERVER_ERROR);
            new ErrorMessageResponse($e->getCode(), $e->getMessage());
        }
    }

    public function postActionPostponeInMaster(Request $request, Response $response): array
    {
        try {
            $data = $request->getParsedBody();
            $masterTicketId = $data->masterTicketId;
            $resolutionId = $data->resolutionId;
            $buttonName = $data->buttonName;

            /** @var OpportunityService  $service */
            $service = $this->getRecordService();

            return $service->putTicketInMaster($masterTicketId, $resolutionId, $buttonName);
        } catch (Exception $e) {
            return  [
                'error' => [
                    'code' => $e->getCode(),
                    'message' => $e->getMessage()
                ]
            ];
        }
    }

    public function getActionIsBrigadeZone(Request $request, Response $response): HttpResponseInterface
    {
        try {
            $houseId = $request->getQueryParam('houseId');

            /** @var OpportunityService  $service */
            $service = $this->getRecordService();

            return new SuccessResponse([
                'result' => $service->isBrigadeZone($houseId)
            ]);
        } catch (Throwable $e) {
            return new ErrorResponse($e->getCode(), $e->getMessage());
        }
    }

    public function getActionCityAliasById(Request $request): HttpResponseInterface
    {
        try {
            $opportunityId = $request->getRouteParam('opportunityId');
            /** @var OpportunityService $opportunityService */
            $opportunityService = $this->getRecordService(OpportunityEntity::ENTITY_TYPE);
            return new SuccessResponse(['alias' => $opportunityService->getActionHouseInfoById($opportunityId)]);
        } catch (Throwable $e) {
            return new ErrorResponse($e->getCode(), $e->getMessage());
        }
    }
}
