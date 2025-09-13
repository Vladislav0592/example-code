<?php


use Espo\Core\Api\Request;
use Espo\Core\Templates\Controllers\Base;
use Espo\Custom\Core\Exceptions\FrontendException;

class PermissionToMasterActions extends Base
{
    /**
     * GET /PermissionToMasterActions/user/:userId
     *
     * @param  Request $request
     * @throws FrontendException
     * @return array
     */
    public function getActionPermissionsByUserId(Request $request): array
    {
        $userId = $request->getRouteParam('userId');

        try {
            if ($userId == null) {
                throw new FrontendException('undefinedUserId');
            }

            return $this->getRecordService()->getAllowedActions($userId);
        } catch (\Throwable $e) {
            throw new FrontendException($e->getMessage(), $e->getCode(), 'PermissionToMaterActions');
        }
    }
}
