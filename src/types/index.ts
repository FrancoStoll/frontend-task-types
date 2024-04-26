import { z } from 'zod'


// auth & users

const authSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string()
})

// User

export const userSchema = authSchema.pick({
  name: true,
  email: true
}).extend({
  _id: z.string()
})

export type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, 'email' | 'password'>
export type UserRegistrationForm = Pick<Auth, 'email' | 'password' | 'name' | 'password_confirmation'>
export type NewPasswordForm = Pick<Auth, 'password' | 'password_confirmation'>

export type confirmToken = Pick<Auth, 'token'>
export type RequestConfirmationCodeForm = Pick<Auth, 'email'>
export type ForgotPasswordForm = Pick<Auth, 'email'>


// Notes

const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  createdBy: userSchema,
  task: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type NoteFormData = Pick<Note, 'content'>

export type Note = z.infer<typeof noteSchema>
export type UserProfileForm = Pick<User, 'name' | 'email'>

// Task

export const taskStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  completedBy: z.array(z.object({
    user: userSchema,
    status: taskStatusSchema,
    _id: z.string()
  })),
  notes: z.array(noteSchema.extend({
    createdBy: userSchema
  }))
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>



export type User = z.infer<typeof userSchema>

// Projects

export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  manager: z.string(userSchema.pick({ _id: true }))
})



// Team

const teamMemberSchema = userSchema.pick({
  name: true,
  email: true,
  _id: true
});
export const teamMembersSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>


export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
)



export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>



