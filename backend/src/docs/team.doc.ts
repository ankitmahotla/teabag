/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Get all published teams in a specific cohort
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
 *                     type: boolean
 *                     example: true
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
 *       Retrieves the details of a specific team by its ID, including team members.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the team to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: 089d1d63-29f2-4b57-9470-acf181b68499
 *                 name:
 *                   type: string
 *                   example: Hydration Error
 *                 description:
 *                   type: string
 *                   nullable: true
 *                   example: ""
 *                 cohortId:
 *                   type: string
 *                   format: uuid
 *                   example: 0023bbee-9b28-4a37-9fd1-40ebe1a720bb
 *                 isPublished:
 *                   type: boolean
 *                   example: false
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       membershipId:
 *                         type: string
 *                         format: uuid
 *                         example: 756fd9e4-8772-49b5-8131-5348b3e29333
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                         example: e9f25759-e292-4e33-94d7-1a6cce4c1468
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Team not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to retrieve team
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

/**
 * @openapi
 * /api/teams/{teamId}/toggle-publish:
 *   put:
 *     summary: Toggle publish state of a team
 *     description: |
 *       Toggles the published state of a team. Only the team leader can perform this action.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         description: UUID of the team to toggle publish state
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Team publish state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team published successfully
 *                 isPublished:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing or invalid team ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing team ID
 *       404:
 *         description: Team not found or not owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Team not found
 *       500:
 *         description: Internal server error while updating publish state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to toggle publish state
 */
