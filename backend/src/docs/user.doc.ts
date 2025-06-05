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

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: |
 *       Retrieves basic user details by user ID.
 *       Useful for referencing user profiles in admin dashboards, teams, or cohorts.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the user to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: Jane Doe
 *                     role:
 *                       type: string
 *                       enum: [admin, user]
 *                       example: user
 *       400:
 *         description: Invalid user ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid user id
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error while retrieving user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/user/team/{cohortId}:
 *   get:
 *     summary: Get user's team in a specific cohort
 *     description: |
 *       Retrieves the team that the currently authenticated user belongs to
 *       within a specific cohort, identified by the cohort ID.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         required: true
 *         description: UUID of the cohort to check for the user's team
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved team details for the user in the cohort
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                         example: a1b2c3d4-e5f6-7890-1234-56789abcdef0
 *                       name:
 *                         type: string
 *                         example: Team Rocket
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-09-15T12:00:00Z
 *       400:
 *         description: Invalid cohort ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid cohort id
 *       404:
 *         description: No team found for the user in the specified cohort
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User is not a part of any teams in the cohort
 *       500:
 *         description: Internal server error while retrieving team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
