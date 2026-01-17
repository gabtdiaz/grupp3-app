using Microsoft.EntityFrameworkCore;
using grupp3_app.Api.Models;

namespace grupp3_app.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }    
    // Bara Users för migration 1
    public DbSet<User> Users { get; set; }
    
    // Migration 2:
    // public DbSet<Event> Events { get; set; }
    // public DbSet<EventParticipant> EventParticipants { get; set; }
    // public DbSet<EventComment> EventComments { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // USER CONFIG
        modelBuilder.Entity<User>(entity =>
        {
            // Primary Key
            entity.HasKey(e => e.Id);

            // Indexes
            entity.HasIndex(e => e.Email).IsUnique(); 
            
            // Basic Identity
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(e => e.PasswordHash)
                .IsRequired();

            // Personal Information
            entity.Property(e => e.FirstName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.DateOfBirth)
                .IsRequired();

            entity.Property(e => e.Gender)
                .IsRequired();

            entity.Property(e => e.City)
                .IsRequired()
                .HasMaxLength(100);

            // Profile (Optional fields)
            entity.Property(e => e.ProfileImageUrl)
                .HasMaxLength(500);  // URL length
                
            entity.Property(e => e.Bio) // Ska vi ha biografi?
                .HasMaxLength(500);  

            // Interests
            entity.Property(e => e.Interests)
                .IsRequired()
                .HasMaxLength(1000);  // Komma-separerad lista

            // Settings (Optional)
            // entity.Property(e => e.MaxDistance)
            //     .IsRequired(false); // Ska vi ha en maxradie?

            // Timestamps
            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.Property(e => e.UpdatedAt)
                .IsRequired(false);  // Nullable DateTime
        });

        // EVENT CONFIG (Kommer i Migration 2)
        /*
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(2000);
            
            entity.HasOne(e => e.CreatedBy)
                .WithMany(u => u.CreatedEvents)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        */

        // EVENT PARTICIPANT CONFIG (Migration 2)
        /*
        modelBuilder.Entity<EventParticipant>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.EventParticipants)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Event)
                .WithMany(ev => ev.Participants)
                .HasForeignKey(e => e.EventId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasIndex(e => new { e.UserId, e.EventId }).IsUnique();
        });
        */

        // EVENT COMMENT CONFIG (Migration 2)
        /*
        modelBuilder.Entity<EventComment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).IsRequired().HasMaxLength(1000);
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            entity.HasOne(e => e.Event)
                .WithMany(ev => ev.Comments)
                .HasForeignKey(e => e.EventId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        */
    }
}