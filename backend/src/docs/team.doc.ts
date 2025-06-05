/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Get all teams in a specific cohort
 *     description: |
 *       Retrieves all teams that belong to the specified cohort.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: query
 *         name: cohortId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cohort to filter teams by
 *     responses:
 *       200:
 *         description: Successfully retrieved teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 089d1d63-29f2-4b57-9470-acf181b68499
 *                   name:
 *                     type: string
 *                     example: Hydration Error
 *                   description:
 *                     type: string
 *                     example: ""
 *                   cohortId:
 *                     type: string
 *                     example: 0023bbee-9b28-4a37-9fd1-40ebe1a720bb
 *                   leaderId:
 *                     type: string
 *                     example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *                   isPublished:
 *                     type: string
 *                     example: "false"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-04T14:06:16.031Z
 *                   disbandedAt:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *       400:
 *         description: CohortId is missing in query
 *       401:
 *         description: User is not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/teams/{id}:
 *   get:
 *     summary: Get team details by ID
 *     description: |
 *       Retrieves the details of a specific team using its ID.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Successfully retrieved team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 089d1d63-29f2-4b57-9470-acf181b68499
 *                   name:
 *                     type: string
 *                     example: Hydration Error
 *                   description:
 *                     type: string
 *                     example: ""
 *                   cohortId:
 *                     type: string
 *                     example: 0023bbee-9b28-4a37-9fd1-40ebe1a720bb
 *                   leaderId:
 *                     type: string
 *                     example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *                   isPublished:
 *                     type: string
 *                     example: "false"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-06-04T14:06:16.031Z
 *                   disbandedAt:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *       401:
 *         description: User is not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     description: |
 *       Creates a new team within a specific cohort.
 *       The authenticated user becomes the team leader and is automatically added to the team.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cohortId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cohortId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Hydration Error
 *                 description:
 *                   type: string
 *                   example: ""
 *                 cohortId:
 *                   type: string
 *                   example: 0023bbee-9b28-4a37-9fd1-40ebe1a720bb
 *                 leaderId:
 *                   type: string
 *                   example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *       400:
 *         description: Validation error or user already has a team in the cohort
 *       401:
 *         description: User is not authenticated
 *       500:
 *         description: Failed to create team
 */
