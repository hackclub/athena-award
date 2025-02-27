// POST /projects/user/[userID]
// Submits a project for the associated user ID
// Project = the request body consisting of project name, project description, demo URL, project image, and repository URL
import { NextResponse } from "next/server";
import Airtable from 'airtable';
import { auth } from '@/auth';
import { encryptSession, verifySession } from '@/utils/hash';

interface Project { // address, github username etc should be pulled from our existing records
    codeUrl: string,
    demoUrl: string,
    screenshot: string, // link to cdn? OR add a file upload modal which then just calls the cdn api BTS, might be easier 
    description: string
}
