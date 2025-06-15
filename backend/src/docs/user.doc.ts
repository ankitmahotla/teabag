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
/**
 * @openapi
 * /api/user/requests/{cohortId}:
 *   get:
 *     summary: Get user's team join requests for a specific cohort
 *     description: |
 *       Retrieves all team joining requests made by the authenticated user in the specified cohort.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: cohortId
 *         required: true
 *         description: UUID of the cohort
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Successfully retrieved team joining requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestId:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       teamId:
 *                         type: string
 *                         format: uuid
 *                         example: a1b2c3d4-e5f6-7890-1234-56789abcdef0
 *                       teamName:
 *                         type: string
 *                         example: Alpha Squad
 *                       status:
 *                         type: string
 *                         enum: [pending, accepted, rejected]
 *                         example: pending
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-10T12:34:56Z
 *       400:
 *         description: Cohort ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cohort ID is required
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error while fetching team join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error fetching team joining requests for user
 */
/**
 * @openapi
 * /api/user/{id}/interactions:
 *   get:
 *     summary: Get user interactions (paginated)
 *     description: |
 *       Retrieves a paginated list of interactions for a given user ID.
 *       Supports cursor-based pagination via `cursor` query parameter.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the user
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of interactions to fetch (default 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: cursor
 *         required: false
 *         description: A timestamp cursor to paginate results
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-06-14T10:00:00Z
 *     responses:
 *       200:
 *         description: Successfully retrieved user interactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Interaction record
 *                     properties:
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-14T12:00:00Z
 *                       ...:
 *                         description: Other interaction-specific fields
 *                 nextCursor:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: 2025-06-13T09:30:00Z
 *       400:
 *         description: Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User ID is required
 *       500:
 *         description: Internal server error while fetching interactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch interactions
 */
