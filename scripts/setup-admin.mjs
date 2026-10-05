import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Helper to load .env.local if not already in process.env
function loadEnv() {
  const envPath = path.join(rootDir, '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (!process.env[key]) {
            process.env[key] = val
          }
        }
      }
    })
  }
}

loadEnv()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groom_glow'

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'admin',
    },
  },
  { timestamps: true }
)

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema)

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Admin email is required.'
  }
  const trimmed = email.trim().toLowerCase()
  if (!trimmed) {
    return 'Admin email cannot be empty.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address (e.g. admin@groomandglow.in).'
  }
  return null
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Admin password is required.'
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasDigitOrSpecial = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)
  if (!hasLetter || !hasDigitOrSpecial) {
    return 'Password must contain a mix of letters and numbers/special characters.'
  }
  return null
}

function validateConfirmation(password, confirmPassword) {
  if (password !== confirmPassword) {
    return 'Passwords do not match. Please verify your password confirmation.'
  }
  return null
}

function createPrompter() {
  const lines = []
  let waitingResolve = null
  let isClosed = false

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  rl.on('line', (line) => {
    if (waitingResolve) {
      const resolve = waitingResolve
      waitingResolve = null
      resolve(line)
    } else {
      lines.push(line)
    }
  })

  rl.on('close', () => {
    isClosed = true
    if (waitingResolve) {
      const resolve = waitingResolve
      waitingResolve = null
      resolve('')
    }
  })

  return {
    async ask(query) {
      process.stdout.write(query)
      if (lines.length > 0) {
        const line = lines.shift()
        if (!process.stdin.isTTY) {
          process.stdout.write(line + '\n')
        }
        return line
      }
      if (isClosed) {
        return ''
      }
      return new Promise((resolve) => {
        waitingResolve = resolve
      })
    },
    close() {
      rl.close()
    },
  }
}

async function setupAdmin() {
  console.log('=== Groom & Glow Initial Admin Setup ===\n')

  console.log('Connecting to database...')
  await mongoose.connect(MONGODB_URI, {
    dbName: 'groom_glow',
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  })

  // 1. Check if an admin already exists before prompting
  const existingCount = await Admin.countDocuments()
  if (existingCount > 0) {
    console.log('\n[Setup Aborted] Initial admin setup has already been completed.')
    console.log(`An administrator account already exists in groom_glow.admins (${existingCount} found).`)
    console.log('To protect existing accounts, setup will not create another admin or overwrite the existing admin.')
    await mongoose.disconnect()
    console.log('Database disconnected.')
    process.exit(0)
  }

  const prompter = createPrompter()

  try {
    const rawEmail = await prompter.ask('Enter admin email: ')
    const email = rawEmail.trim()
    const emailErr = validateEmail(email)
    if (emailErr) {
      console.error(`\n[Validation Error] ${emailErr}`)
      prompter.close()
      await mongoose.disconnect()
      process.exit(1)
    }

    const rawPassword = await prompter.ask('Enter admin password: ')
    const password = rawPassword.trim()
    const passwordErr = validatePassword(password)
    if (passwordErr) {
      console.error(`\n[Validation Error] ${passwordErr}`)
      prompter.close()
      await mongoose.disconnect()
      process.exit(1)
    }

    const rawConfirm = await prompter.ask('Confirm admin password: ')
    const confirmPassword = rawConfirm.trim()
    const confirmErr = validateConfirmation(password, confirmPassword)
    if (confirmErr) {
      console.error(`\n[Validation Error] ${confirmErr}`)
      prompter.close()
      await mongoose.disconnect()
      process.exit(1)
    }

    prompter.close()

    // 2. Re-verify no admin was created concurrently
    const recheckCount = await Admin.countDocuments()
    if (recheckCount > 0) {
      console.log('\n[Setup Aborted] Initial admin setup has already been completed.')
      console.log('An administrator account already exists in groom_glow.admins.')
      console.log('No changes were made.')
      await mongoose.disconnect()
      process.exit(0)
    }

    const normalizedEmail = email.toLowerCase()
    console.log(`\nHashing password for ${normalizedEmail}...`)
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    await Admin.create({
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
    })

    console.log(`[Success] Initial admin account created successfully in groom_glow.admins for: ${normalizedEmail}`)
    console.log('Initial setup is complete. You can now log in at /admin.')
  } finally {
    prompter.close()
    await mongoose.disconnect()
    console.log('Database disconnected.')
  }
}

setupAdmin().catch((err) => {
  console.error('\n[Error during admin setup]:', err)
  process.exit(1)
})
