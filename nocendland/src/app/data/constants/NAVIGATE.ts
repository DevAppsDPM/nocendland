import { ROUTES } from "./ROUTES";

const ROUTE_BASE_NUTRITION = ROUTES.MODULES.LLIMBRO.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.NUTRITION + '/'

export const NAVIGATE = {
    INTAKE_VIEW: ROUTE_BASE_NUTRITION + ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INTAKE.VIEW,
    SELECT_INGREDIENTS: ROUTE_BASE_NUTRITION + ROUTES.MODULES.LLIMBRO.INTAKE.ROUTE + '/' + ROUTES.MODULES.LLIMBRO.INTAKE.SELECT_INGREDIENTS
}