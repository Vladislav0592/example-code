<?php

namespace Services;

use Espo\Custom\Core\ApiBilling\ApiBillingRepository;
use Espo\Custom\Core\HistoryChangeEntity\Helpers\CustomOpportunityFieldsHelper;
use Espo\Custom\Core\Master\Client\MasterSibsetRepository;
use Espo\Custom\Core\Master\Exceptions\OpportunityNotFoundException;
use Espo\Custom\Core\Utils\Clients\Exceptions\DefaultServiceNotAvailableException;
use Espo\Modules\CustomOpportunity\Enums\StageIdsEnums;
use Espo\Modules\CustomOpportunity\Enums\MasterActionsFieldsEnum;
use Espo\Modules\CustomOpportunity\Helpers\OpportunityToMasterHelper;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\HttpFoundation\Response;

class Opportunity extends OpportunityServices
{
    private Translate $translate;

    public function __construct(
        private MasterSibsetRepository        $masterSibsetRepository,
        private ApiBillingRepository          $apiBillingRepository,
        private CustomOpportunityFieldsHelper $opportunityFieldsHelper,
        private StageIdsEnums                 $stageIdsEnums,
        private OpportunityToMasterHelper     $opportunityToMasterHelper
    ) {
        parent::__construct(OpportunityEntity::ENTITY_TYPE);
        $this->translate = new Translate($this->language, OpportunityEntity::ENTITY_TYPE);
    }

    /**
     * @throws GuzzleException
     */
    public function getStatusInMaster(string $masterTicketId, string $stageId): ?array
    {
        $statusInMaster = $this->masterSibsetRepository->getTicketByMasterTicketIdConnection($masterTicketId);
        $masterStatusId = $this->repositoryFactory->getOpportunityStageRepository()->getIdByAlias($statusInMaster['data']['status']);

        if ($stageId !== $masterStatusId) {
            return [];
        }

        return $this->masterSibsetRepository->getFreeSlotsByMasterTicketId($masterTicketId);
    }

    /**
     * @throws GuzzleException
     * @throws OpportunityNotFoundException
     */
    public function putTicketInMaster(string $masterTicketId, string $masterResolutionId, ?string $nameButton): array
    {
        $resolutionId = $this->repositoryFactory->getReasonChangeStageRepository()->getMasterResolutionIdById($masterResolutionId);

        if ('' === $resolutionId) {
            return ['error' => ['code' => Response::HTTP_BAD_REQUEST, 'message' => 'masterResolutionId не может быть пустым']];
        }

        $this->masterSibsetRepository->patchTicketStatusInMaster($masterTicketId, $resolutionId, 'resumed');
        $this->createChangeHistory($masterTicketId, $nameButton);

        return ['status' => Response::HTTP_OK];
    }

    /**
     * @throws GuzzleException
     * @throws OpportunityNotFoundException
     */
    public function setSchedulingInMaster(string $masterTicketId, ?string $timeFrameId, string $intervalStart, ?string $nameButton): void
    {
        $this->masterSibsetRepository->putApiV1SchedulingInMaster($masterTicketId, $timeFrameId, $intervalStart);

        $this->createChangeHistory($masterTicketId, $nameButton);
    }

    private function createChangeHistory(string $masterTicketId, string $nameButton): void
    {
        $opportunity = $this->repositoryFactory->getOpportunityRepository()->getOpportunityByMasterId($masterTicketId);
        $createdEntitiesData['newValue'] = $nameButton;
        $createdEntitiesData['oldValue'] = $opportunity->opportunityStage->name;
        $this->opportunityFieldsHelper->saveCreateCustomFields(MasterActionsFieldsEnum::STATUS_IN_MASTER, $opportunity->id, $createdEntitiesData);
    }

    /**
     * @throws DefaultServiceNotAvailableException
     */
    public function createTicketInMaster(string $opportunityId): void
    {
        $opportunity = $this->repositoryFactory->getOpportunityRepository()->getById($opportunityId);
        $this->opportunityToMasterHelper->createTicketConnection($opportunity);
    }

    public function getActionHouseInfoById(string $id): ?string
    {
        /** @var OpportunityCustomEntity $opportunity */
        $opportunity = $this->repositoryFactory->getOpportunityRepository()->where(['id' => $id])->findOne();
        /** @var HouseEntity $house */
        $house = $this->repositoryFactory->getHouseRepository()->where(['id' => $opportunity->houseId])->findOne();
        /** @var Location $location */
        $location = $this->repositoryFactory->getLocationRepository()->where(['name' => $house->addressCity ?? $house->addressLocality])->findOne();

        return $location->alias;
    }
}
