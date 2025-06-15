/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Get all published teams in a specific cohort
 *     description: |
 *       Retrieves all active, published teams within the specified cohort.
 *       Requires user authentication via HTTP-only cookies.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: query
 *         name: cohortId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the cohort to filter teams by
 *     responses:
 *       200:
 *         description: Successfully retrieved list of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   cohortId:
 *                     type: string
 *                   isPublished:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   disbandedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   memberCount:
 *                     type: integer
 *       400:
 *         description: CohortId is required
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     description: |
 *       Creates a new team within the specified cohort. The authenticated user becomes the team leader and is added as a member.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, cohortId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               cohortId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Missing name or cohortId, or user already has a team
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: User not a member of the cohort
 *       500:
 *         description: Failed to create team
 */

/**
 * @openapi
 * /api/teams/{id}:
 *   get:
 *     summary: Get team details by ID
 *     description: Retrieves a team's full details, including active members.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team retrieved
 *       400:
 *         description: Missing team ID
 *       404:
 *         description: Team not found
 *       500:
 *         description: Failed to retrieve team
 */

/**
 * @openapi
 * /api/teams/{teamId}/toggle-publish:
 *   put:
 *     summary: Toggle team publish state
 *     description: Toggle a team’s published status. Only team leaders can perform this.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Publish state toggled successfully
 *       400:
 *         description: Missing team ID
 *       404:
 *         description: Team not found or user is not the leader
 *       500:
 *         description: Failed to toggle publish state
 */

/**
 * @openapi
 * /api/teams/{teamId}/request-join:
 *   post:
 *     summary: Request to join a team
 *     description: Sends a join request to a team. Team must be in same cohort and not full.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cohortId]
 *             properties:
 *               cohortId:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request submitted
 *       400:
 *         description: Invalid team or self-join or already requested
 *       500:
 *         description: Failed to request join
 */

/**
 * @openapi
 * /api/teams/{teamId}/request-join:
 *   put:
 *     summary: Withdraw join request
 *     description: Allows a user to withdraw a join request if 24 hours have passed.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request withdrawn
 *       400:
 *         description: Cannot withdraw within 24 hours or if accepted
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/teams/{teamId}/request-status:
 *   get:
 *     summary: Get team join request status
 *     description: Checks if the authenticated user has a join request for the specified team.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status retrieved
 *       400:
 *         description: Invalid team ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve status
 */

/**
 * @openapi
 * /api/teams/{teamId}/members:
 *   get:
 *     summary: Get members of a team
 *     description: Lists all active members in a team
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members retrieved
 *       400:
 *         description: Team ID required
 *       404:
 *         description: Team not found
 *       500:
 *         description: Failed to fetch members
 */

/**
 * @openapi
 * /api/teams/{teamId}/kickUser:
 *   post:
 *     summary: Kick a user from the team
 *     description: Only team leaders can kick members.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [teamMemberId, reason]
 *             properties:
 *               teamMemberId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member kicked successfully
 *       400:
 *         description: Missing fields
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Failed to kick member
 */

/**
 * @openapi
 * /api/teams/{teamId}/disband:
 *   post:
 *     summary: Disband a team
 *     description: Only the team leader can disband a team, providing a reason.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team disbanded successfully
 *       400:
 *         description: Missing teamId or reason
 *       403:
 *         description: Only leader can disband
 *       404:
 *         description: Team not found
 *       500:
 *         description: Failed to disband
 */

/**
 * @openapi
 * /api/teams/{teamId}/leadership-transfer:
 *   post:
 *     summary: Request leadership transfer
 *     description: Request to transfer leadership to another active team member.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiverId, reason]
 *             properties:
 *               receiverId:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request submitted
 *       400:
 *         description: Missing required fields or invalid receiver
 *       403:
 *         description: Only leaders can transfer
 *       409:
 *         description: Existing pending transfer
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/teams/{teamId}/leadership-transfer/respond:
 *   post:
 *     summary: Respond to leadership transfer request
 *     description: Accept, reject, or cancel a pending leadership transfer request.
 *     tags:
 *       - Teams
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [transferRequestId, status]
 *             properties:
 *               transferRequestId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected, cancelled]
 *     responses:
 *       200:
 *         description: Transfer handled
 *       400:
 *         description: Invalid request or already handled
 *       403:
 *         description: Unauthorized action
 *       500:
 *         description: Failed to respond
 */

/**
 * @openapi
 * /api/teams/leadership-transfer/requests/pending:
 *   get:
 *     summary: Get pending leadership transfer requests
 *     description: Returns any leadership transfer requests involving the authenticated user.
 *     tags:
 *       - Teams
 *     responses:
 *       200:
 *         description: Pending request retrieved
 *       500:
 *         description: Failed to fetch pending requests
 */

/**
 * @openapi
 * /api/teams/{teamId}/leave:
 *   post:
 *     summary: Leave a team
 *     description: |
 *       Allows an authenticated user to leave a team they are currently a member of.
 *       The reason for leaving can be optionally provided.
 *       Team leaders must transfer leadership before leaving the team.
 *     tags:
 *       - Teams
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the team to leave
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Optional reason for leaving the team
 *     responses:
 *       200:
 *         description: Successfully left the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team left successfully
 *       400:
 *         description: Missing team ID or team leader attempting to leave
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Team leader cannot leave without transferring leadership.
 *       404:
 *         description: Team not found or user is not a member
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
 *                   example: Failed to leave team
 */
