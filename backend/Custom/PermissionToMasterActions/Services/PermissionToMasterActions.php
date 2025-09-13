<?php

namespace Services;

use Espo\Core\Templates\Services\Base;
use Espo\Custom\Core\Exceptions\FrontendException;
use Espo\Modules\CustomTeam\Entities\Team;
use Espo\Modules\CustomUser\Repositories\User as UserRepository;

class PermissionToMasterActions extends Base
{
    public function __construct(
        private UserRepository $userRepository,
        string $entityType = ''
    ) {
        parent::__construct($entityType);
    }

    /**
     * @param string $userId
     * @return array
     */
    public function getAllowedActions(string $userId): array
    {
        $user = $this->userRepository->getById($userId);
        if (null === $user) {
            throw new FrontendException('notFoundUser');
        }

        $userTeams = $this->userRepository->getAllUserTeams($user);
        $permissions = [];
        $teamRepo = $this->entityManager->getRDBRepository(Team::ENTITY_TYPE);
        foreach ($userTeams as $userTeam) {
            $acessNotes = $teamRepo->getRelation($userTeam, 'permissionToMasterActions')->find();
            foreach ($acessNotes as $acessNote) {
                $permission = $acessNote->get('actions');
                $permissions = array_merge($permissions, $permission);
            }
        }

        if (!empty($permissions)) {
            $permissions = array_unique($permissions);
        }

        return $permissions;
    }
}
