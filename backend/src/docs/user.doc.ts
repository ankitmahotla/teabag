/**
 * @openapi
 * /api/user/cohorts:
 *   get:
 *     summary: Get cohorts the authenticated user belongs to
 *     description: |
 *       Retrieves all cohort details that the currently authenticated user is a member of.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved user cohorts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cohortsDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       cohortId:
 *                         type: string
 *                         example: 64b8f0a0-1234-5678-9abc-def012345678
 *                       name:
 *                         type: string
 *                         example: Cohort 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-01-01T00:00:00Z
 *
 *       401:
 *         description: User not authenticated or session invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       404:
 *         description: No cohorts found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User is not a part of any cohorts
 *       500:
 *         description: Internal server error while retrieving cohorts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
