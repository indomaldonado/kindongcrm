"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSupporter(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const category = formData.get("category") as string;

    await prisma.supporter.create({
        data: {
            name,
            email,
            phone,
            category,
        },
    });

    revalidatePath("/supporters");
}

export async function getSupporters(query?: string) {
    const where: any = {};
    if (query) {
        where.OR = [
            { name: { contains: query } },
            { email: { contains: query } },
            { phone: { contains: query } },
        ];
    }

    return await prisma.supporter.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { donations: true, prayerCommitments: true }
            }
        }
    });
}

export async function getSupporterDetails(id: string) {
    return await prisma.supporter.findUnique({
        where: { id },
        include: {
            donations: { orderBy: { date: "desc" } },
            prayerCommitments: true,
        },
    });
}

export async function addDonation(formData: FormData) {
    const supporterId = formData.get("supporterId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const date = new Date(formData.get("date") as string);
    const notes = formData.get("notes") as string;

    await prisma.donation.create({
        data: {
            supporterId,
            amount,
            date,
            notes,
        },
    });

    revalidatePath(`/supporters/${supporterId}`);
    revalidatePath("/donations");
}

export async function addPrayerCommitment(formData: FormData) {
    const supporterId = formData.get("supporterId") as string;
    const frequency = formData.get("frequency") as string;
    const dayOfWeek = formData.get("dayOfWeek") as string;
    const notes = formData.get("notes") as string;

    await prisma.prayerCommitment.create({
        data: {
            supporterId,
            frequency,
            dayOfWeek,
            notes,
        },
    });

    revalidatePath(`/supporters/${supporterId}`);
}

export async function updateSupporter(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const category = formData.get("category") as string;

    await prisma.supporter.update({
        where: { id },
        data: { name, email, phone, category },
    });

    revalidatePath(`/supporters/${id}`);
    revalidatePath("/supporters");
}

export async function deleteSupporter(formData: FormData) {
    const id = formData.get("id") as string;

    await prisma.supporter.delete({
        where: { id },
    });

    const { redirect } = await import("next/navigation");
    revalidatePath("/supporters");
    redirect("/supporters");
}

export async function updateSupporterCategory(formData: FormData) {
    const id = formData.get("id") as string;
    const category = formData.get("category") as string;

    await prisma.supporter.update({
        where: { id },
        data: { category },
    });

    revalidatePath(`/supporters/${id}`);
    revalidatePath("/supporters");
}

export async function sendBulkEmail(formData: FormData) {
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    const recipientType = formData.get("recipientType") as string;
    const supporterId = formData.get("supporterId") as string;

    const apiKey = process.env.RESEND_API_KEY;

    // Filter supporters based on category and presence of email
    const where: any = { email: { not: null } };

    if (recipientType === "INDIVIDUAL" && supporterId) {
        where.id = supporterId;
    } else if (recipientType === "DONOR") {
        where.category = { in: ["DONOR", "BOTH"] };
    } else if (recipientType === "INTERCESSOR") {
        where.category = { in: ["INTERCESSOR", "BOTH"] };
    }

    const recipients = await prisma.supporter.findMany({
        where,
        select: { email: true, name: true }
    });

    if (recipients.length === 0) {
        return { success: false, error: "No recipients found with a valid email address." };
    }

    if (!apiKey || apiKey === "re_123456789") {
        console.log("Email Simulation (No API Key):", {
            to: recipients.map(r => r.email),
            subject,
            body
        });
        // Simulate success for development if key is missing
        return { success: true, count: recipients.length, simulated: true };
    }

    try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "Mission CRM <onboarding@resend.dev>";
        const replyTo = process.env.RESEND_REPLY_TO || fromEmail;

        const results = await Promise.all(
            recipients.map(recipient =>
                resend.emails.send({
                    from: fromEmail,
                    to: recipient.email as string,
                    replyTo: replyTo,
                    subject: subject,
                    text: body.replace("{name}", recipient.name),
                })
            )
        );

        return { success: true, count: results.length };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

